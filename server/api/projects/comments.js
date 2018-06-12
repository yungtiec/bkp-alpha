const router = require("express").Router({ mergeParams: true });
const db = require("../../db");
const {
  Comment,
  User,
  Role,
  Tag,
  Issue,
  Notification
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
      const isAdmin = await User.findOne({
        where: { id: req.user.id },
        include: [
          {
            model: Role
          }
        ]
      }).then(
        requestor => requestor.roles.filter(r => r.name === "admin").length
      );
      const comment = await Comment.create({
        owner_id: req.user.id,
        project_survey_id: Number(req.params.projectSurveyId),
        comment: req.body.comment,
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
        { comment: req.body.comment, reviewed: "pending" }
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
      const user = await User.findById(req.user.id);
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
      var prevTags = comment.tags || [];
      var removedTags = prevTags.filter(function(prevTag) {
        return req.body.tags.map(tag => tag.name).indexOf(prevTag.name) === -1;
      });
      var addedTags = req.body.tags
        ? req.body.tags.filter(tag => {
            return (
              prevTags.map(prevTag => prevTag.name).indexOf(tag.name) === -1
            );
          })
        : [];
      var removedTagPromises, addedTagPromises, issuePromise;
      if (comment.owner.email !== req.user.email) res.sendStatus(401);
      else {
        await comment.update({ comment: req.body.updatedComment });
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

router.put(
  "/tag/remove",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      const comment = await Comment.findById(Number(req.body.commentId));
      await comment.removeTag(req.body.tagId);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/tag/add",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      const comment = await Comment.findById(Number(req.body.commentId));
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

router.get("/pending/:projectSurveyId", async (req, res, next) => {
  try {
    var comments = await Comment.findAll({
      where: {
        reviewed: "pending",
        project_survey_id: req.params.projectSurveyId
      },
      include: [
        {
          model: User,
          as: "owner"
        },
        {
          model: Comment,
          as: "parent",
          include: [
            {
              model: User,
              as: "owner"
            }
          ]
        }
      ]
    });
    res.send(comments);
  } catch (err) {
    next(err);
  }
});
