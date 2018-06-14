const router = require("express").Router({ mergeParams: true });
const db = require("../../db");
const ac = require("../../access-control");
const {
  Comment,
  User,
  Role,
  Tag,
  Issue,
  Notification,
  ProjectSurvey,
  Project,
  Survey
} = require("../../db/models");
const _ = require("lodash");
const {
  ensureAuthentication,
  ensureAdminRole,
  ensureAdminRoleOrCommentOwnership,
  ensureResourceAccess
} = require("../utils");
Promise = require("bluebird");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const comments = await Comment.scope({
      method: [
        "flatThreadByRootId",
        {
          where: {
            project_survey_id: req.params.projectSurveyId,
            hierarchyLevel: 1
          }
        }
      ]
    }).findAll();
    res.send(comments);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      const isAdmin = req.user.roles.filter(r => r.name === "admin").length;
      const comment = await Comment.create({
        owner_id: req.user.id,
        project_survey_id: Number(req.params.projectSurveyId),
        comment: req.body.newComment,
        reviewed: isAdmin ? "verified" : "pending"
      })
        .then(async comment => {
          if (req.body.issueOpen)
            await Issue.create({
              open: true,
              comment_id: comment.id
            });
          return comment;
        })
        .then(comment => {
          return Promise.map(req.body.tags, async addedTag => {
            const [tag, created] = await Tag.findOrCreate({
              where: { name: addedTag.name },
              default: { name: addedTag.name }
            });
            return comment.addTag(tag.id);
          }).then(() =>
            Comment.scope({
              method: ["flatThreadByRootId", { where: { id: comment.id } }]
            }).findOne()
          );
        });
      res.send(comment);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:parentId/reply",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      var ancestry;
      const isAdmin = req.user.roles.filter(r => r.name === "admin").length;
      const parent = await Comment.findById(Number(req.params.parentId));
      const child = _.assignIn(
        _.omit(parent.toJSON(), [
          "id",
          "createdAt",
          "updatedAt",
          "hierarchyLevel",
          "parentId",
          "comment",
          "reviewed",
          "owner"
        ]),
        {
          comment: req.body.newComment,
          reviewed: isAdmin ? "verified" : "pending"
        }
      );
      var [ancestors, reply, user] = await Promise.all([
        parent
          .getAncestors({
            include: [
              {
                model: db.model("user"),
                as: "owner",
                required: false
              }
            ]
          })
          .then(ancestors =>
            _.orderBy(ancestors, ["hierarchyLevel"], ["asc"]).concat(parent)
          ),
        Comment.create(child),
        User.findById(req.user.id)
      ]);
      var rootAncestor = ancestors[0];
      reply = await reply.setParent(parent.toJSON().id);
      reply = await reply.setOwner(req.user.id);
      ancestry = await Comment.scope({
        method: [
          "flatThreadByRootId",
          { where: { id: rootAncestor ? rootAncestor.id : parent.id } }
        ]
      }).findOne();
      await Notification.notifyRootAndParent({
        sender: user,
        comment: _.assignIn(reply.toJSON(), {
          ancestors,
          project_survey: ancestry.project_survey
        }),
        parent,
        messageFragment: "replied to your post"
      });
      res.send(ancestry);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:commentId/upvote",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      if (!req.body.hasUpvoted) {
        await req.user.addUpvotedComment(req.params.commentId);
      } else {
        await req.user.removeUpvotedComment(req.params.commentId);
      }
      const comment = await Comment.scope({
        method: ["upvotes", req.params.commentId]
      }).findOne();
      if (!req.body.hasUpvoted) {
        await Notification.notify({
          sender: req.user,
          comment,
          messageFragment: "liked your post"
        });
      }
      res.send({
        upvotesFrom: comment.upvotesFrom,
        commentId: comment.id
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:commentId/edit",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      var comment = await Comment.findOne({
        where: { id: req.params.commentId },
        include: [
          {
            model: User,
            as: "owner",
            attributes: ["first_name", "last_name", "email"]
          },
          {
            model: db.model("tag"),
            attributes: ["name", "id"],
            required: false
          },
          {
            model: db.model("issue"),
            required: false
          }
        ]
      });
      if (comment.owner.email !== req.user.email) res.sendStatus(401);
      else {
        var prevTags = comment.tags || [];
        var removedTags = prevTags.filter(function(prevTag) {
          return (
            req.body.tags.map(tag => tag.name).indexOf(prevTag.name) === -1
          );
        });
        var addedTags = req.body.tags
          ? req.body.tags.filter(tag => {
              return (
                prevTags.map(prevTag => prevTag.name).indexOf(tag.name) === -1
              );
            })
          : [];
        var removedTagPromises, addedTagPromises, issuePromise;
        await comment.update({ comment: req.body.newComment });
        removedTagPromises = Promise.map(removedTags, tag =>
          comment.removeTag(tag.id)
        );
        addedTagPromises = Promise.map(addedTags, async addedTag => {
          const [tag, created] = await Tag.findOrCreate({
            where: { name: addedTag.name },
            default: { name: addedTag.name }
          });
          return comment.addTag(tag.id);
        });
        issuePromise =
          "issueOpen" in req.body &&
          (req.body.issueOpen || (!req.body.issueOpen && comment.issue))
            ? Issue.findOrCreate({
                defaults: {
                  open: req.body.issueOpen
                },
                where: { comment_id: comment.id }
              }).spread((issue, created) => {
                if (!created) issue.update({ open: req.body.issueOpen });
              })
            : null;
        await Promise.all([removedTagPromises, addedTagPromises, issuePromise]);
        const ancestors = await comment.getAncestors({
          raw: true
        });
        const rootAncestor = _.orderBy(
          ancestors,
          ["hierarchyLevel"],
          ["asc"]
        )[0];
        const ancestry = await Comment.scope({
          method: [
            "flatThreadByRootId",
            { where: { id: rootAncestor ? rootAncestor.id : comment.id } }
          ]
        }).findOne();
        res.send(ancestry);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:commentId/tags/:tagId",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      const comment = await Comment.findById(Number(req.params.commentId));
      await comment.removeTag(req.params.tagId);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:commentId/tags",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      const comment = await Comment.findById(Number(req.params.commentId));
      const [tag, created] = await Tag.findOrCreate({
        where: { name: req.body.tagName },
        default: { name: req.body.tagName }
      });
      await comment.addTag(tag.id);
      res.send(tag);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:commentId/verify",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      var comment = await Comment.findOne({
        where: { id: req.params.commentId },
        include: [
          {
            model: ProjectSurvey,
            include: [
              {
                model: db.model("user"),
                as: "collaborators",
                required: false
              }
            ]
          }
        ]
      });
      const permission = ac.can(req.user.roles[0].name).updateAny("comment");
      const canVerify = permission.attributes.indexOf("verify") !== -1;
      const isEditor = req.user.roles[0].name === "editor";
      const isProjectSurveyCollaborator = _.find(
        comment.project_survey.collaborators,
        c => c.id === req.user.id
      );
      const isProjectSurveyOwner =
        req.user.id === comment.project_survey.creator_id;
      if (
        !canVerify ||
        (canVerify &&
          isEditor &&
          !isProjectSurveyOwner &&
          !isProjectSurveyCollaborator)
      ) {
        res.sendStatus(403);
      } else {
        comment.update({ reviewed: req.body.reviewed });
        res.sendStatus(200);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:commentId/issue",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      var comment = await Comment.findOne({
        where: { id: req.params.commentId },
        include: [
          {
            model: Issue
          },
          {
            model: ProjectSurvey,
            include: [
              {
                model: Project,
                attributes: ["symbol"]
              },
              {
                model: Survey,
                attributes: ["title"]
              },
              {
                model: db.model("user"),
                as: "collaborators",
                required: false
              }
            ]
          }
        ]
      });
      const permission = ac.can(req.user.roles[0].name).updateAny("comment");
      const canIssue = permission.attributes.indexOf("issue") !== -1;
      const isEditor = req.user.roles[0].name === "editor";
      const isProjectSurveyCollaborator = _.find(
        comment.project_survey.collaborators,
        c => c.id === req.user.id
      );
      const isProjectSurveyOwner =
        req.user.id === comment.project_survey.creator_id;
      const isOwner = req.user.id === comment.owner_id;
      if (
        (!canIssue && !isOwner) ||
        (canIssue &&
          isEditor &&
          !isProjectSurveyOwner &&
          !isProjectSurveyCollaborator)
      ) {
        res.sendStatus(403);
        return;
      }
      comment.issue
        ? await Issue.update(
            {
              open: req.body.open
            },
            {
              where: { id: comment.issue.id }
            }
          )
        : Issue.create({
            open: req.body.open,
            comment_id: req.params.commentId
          });
      if (!req.body.open && req.user.id !== comment.owner_id) {
        await Notification.notify({
          sender: "",
          comment,
          messageFragment: `${req.user.email} closed your issue in ${
            comment.project_survey.project.symbol
          }/${comment.project_survey.survey.title}.`
        });
      }
      if (req.body.open && req.user.id !== comment.owner_id) {
        await Notification.notify({
          sender: "",
          comment,
          messageFragment: `${
            req.user.email
          } opened an issue on your comment in ${
            comment.project_survey.project.symbol
          }/${comment.project_survey.survey.title}.`
        });
      }

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);
