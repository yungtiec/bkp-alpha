const router = require("express").Router();
const db = require("../../db");
const {
  User,
  Role,
  Tag,
  ProjectSurveyComment,
  Issue,
  Notification
} = require("../../db/models");
const _ = require("lodash");
const { ensureAuthentication, ensureAdminRole } = require("../utils");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const comments = await ProjectSurveyComment.scope({
      method: ["allByProjectSurveyId", req.query.projectSurveyId]
    }).findAll();
    res.send(comments);
  } catch (err) {
    next(err);
  }
});

router.post("/", ensureAuthentication, async (req, res, next) => {
  try {
    const comment = await ProjectSurveyComment.create({
      owner_id: req.user.id,
      project_survey_id: Number(req.body.projectSurveyId),
      comment: req.body.comment
    })
      .then(async comment => {
        if (req.body.issueOpen)
          await Issue.create({
            open: true,
            project_survey_comment_id: comment.id
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
          ProjectSurveyComment.scope({
            method: ["oneThreadByRootId", comment.id]
          }).findOne()
        );
      });
    res.send(comment);
  } catch (err) {
    next(err);
  }
});

router.post("/reply", ensureAuthentication, async (req, res, next) => {
  try {
    var ancestry;
    const parent = await ProjectSurveyComment.scope({
      method: ["withProjectSurveyInfo", Number(req.body.parentId)]
    }).findOne();
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
      { comment: req.body.comment, owner_id: req.user.id, reviewed: "pending" }
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
      ProjectSurveyComment.create(child),
      User.findById(req.user.id)
    ]);
    var rootAncestor = ancestors[0];
    reply = await reply.setParent(parent.toJSON().id);
    reply = await reply.setOwner(req.user.id);
    ancestry = await ProjectSurveyComment.scope({
      method: ["oneThreadByRootId", rootAncestor ? rootAncestor.id : parent.id]
    }).findOne();
    await Notification.notifyAncestors({
      sender: user,
      engagementItem: _.assignIn(reply.toJSON(), {
        ancestors,
        project_survey: parent.project_survey
      }),
      messageFragment: "replied to your post"
    });
    res.send(ancestry);
  } catch (err) {
    next(err);
  }
});

router.post("/upvote", ensureAuthentication, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!req.body.hasUpvoted) {
      await user.addUpvotedComment(req.body.commentId);
    } else {
      await user.removeUpvotedComment(req.body.commentId);
    }
    const comment = await ProjectSurveyComment.scope({
      method: ["upvotes", req.body.commentId]
    }).findOne();
    if (!req.body.hasUpvoted) {
      await Notification.notify({
        sender: user,
        engagementItem: comment,
        messageFragment: "like your post"
      });
    }
    res.send({ upvotesFrom: comment.upvotesFrom, commentId: comment.id });
  } catch (err) {
    next(err);
  }
});

router.post("/edit", ensureAuthentication, async (req, res, next) => {
  try {
    var comment = await ProjectSurveyComment.findOne({
      where: { id: req.body.commentId },
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["first_name", "last_name", "email"]
        },
        {
          model: db.model("tag"),
          attributes: ["name", "id"]
        }
      ]
    });
    var prevTags = comment.tags;
    var removedTags = prevTags.filter(function(prevTag) {
      return req.body.tags.map(tag => tag.name).indexOf(prevTag.name) === -1;
    });
    var addedTags = req.body.tags.filter(tag => {
      return prevTags.map(prevTag => prevTag.name).indexOf(tag.name) === -1;
    });
    var removedTagPromises, addedTagPromises, issuePromise;
    if (comment.owner.email !== req.user.email) res.sendStatus(401);
    else {
      comment = await comment.update({ comment: req.body.comment });
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
        "issueOpen" in req.body
          ? Issue.findOrCreate({
              defaults: {
                open: req.body.issueOpen
              },
              where: { project_survey_comment_id: comment.id }
            }).spread((issue, created) => {
              if (!created) issue.update({ open: req.body.issueOpen });
            })
          : null;
      await Promise.all([removedTagPromises, addedTagPromises, issuePromise]);
      const ancestors = await comment.getAncestors({
        raw: true
      });
      const rootAncestor = _.orderBy(ancestors, ["hierarchyLevel"], ["asc"])[0];
      const ancestry = await ProjectSurveyComment.scope({
        method: [
          "oneThreadByRootId",
          rootAncestor ? rootAncestor.id : comment.id
        ]
      }).findOne();
      res.send(ancestry);
    }
  } catch (err) {
    next(err);
  }
});

router.post(
  "/verify",
  ensureAuthentication,
  ensureAdminRole,
  async (req, res, next) => {
    try {
      var comment = await ProjectSurveyComment.findById(req.body.commentId);
      comment.update({ reviewed: req.body.reviewed });
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/issue",
  ensureAuthentication,
  ensureAdminRole,
  async (req, res, next) => {
    try {
      var comment = await ProjectSurveyComment.findOne({
        where: { id: req.body.commentId },
        include: [
          {
            model: Issue
          }
        ]
      });
      comment.issue
        ? await Issue.update(
            {
              open: req.body.open
            },
            {
              where: { id: comment.issue.id }
            }
          )
        : await Issue.create({
            open: req.body.open,
            project_survey_comment_id: req.body.commentId
          });
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);
