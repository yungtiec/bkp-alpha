const router = require("express").Router();
const db = require("../db");
const {
  Annotation,
  User,
  Role,
  Tag,
  ProjectSurveyComment
} = require("../db/models");
const _ = require("lodash");
const { ensureAuthentication, ensureAdminRole } = require("./utils");
module.exports = router;

router.get("/comment", async (req, res, next) => {
  try {
    const comments = await ProjectSurveyComment.findCommentsByProjectSurveyId(
      req.query.projectSurveyId
    );
    res.send(comments);
  } catch (err) {
    next(err);
  }
});

router.post("/comment", ensureAuthentication, async (req, res, next) => {
  try {
    const comment = await ProjectSurveyComment.create({
      owner_id: req.user.id,
      project_survey_id: Number(req.body.projectSurveyId),
      comment: req.body.comment
    }).then(c => ProjectSurveyComment.findOneThreadByRootId(c.id));
    res.send(comment);
  } catch (err) {
    next(err);
  }
});

router.post("/comment/reply", ensureAuthentication, async (req, res, next) => {
  try {
    var ancestry;
    const parent = await ProjectSurveyComment.findById(
      Number(req.body.parentId)
    );
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
    const ancestors = await parent.getAncestors({ raw: true });
    var rootAncestor = _.orderBy(ancestors, ["hierarchyLevel"], ["asc"])[0];
    var reply = await ProjectSurveyComment.create(child);
    reply = await reply.setParent(parent.toJSON().id);
    reply = reply.setOwner(req.user.id);
    ancestry = await ProjectSurveyComment.findOneThreadByRootId(
      rootAncestor ? rootAncestor.id : parent.id
    );
    res.send(ancestry);
  } catch (err) {
    next(err);
  }
});

router.post("/comment/upvote", ensureAuthentication, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!req.body.hasUpvoted) {
      await user.addUpvotedComment(req.body.commentId);
    } else {
      await user.removeUpvotedComment(req.body.commentId);
    }
    const comment = await ProjectSurveyComment.findOne({
      where: { id: req.body.commentId },
      include: [
        {
          model: User,
          as: "upvotesFrom",
          attributes: ["first_name", "last_name", "email"]
        }
      ]
    });
    res.send({ upvotesFrom: comment.upvotesFrom, commentId: comment.id });
  } catch (err) {
    next(err);
  }
});

router.post("/comment/edit", ensureAuthentication, async (req, res, next) => {
  try {
    var comment = await ProjectSurveyComment.findOne({
      where: { id: req.body.commentId },
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["first_name", "last_name", "email"]
        }
      ]
    });
    if (comment.owner.email !== req.user.email) res.sendStatus(401);
    else {
      comment = await comment.update({ comment: req.body.comment });
      const ancestors = await comment.getAncestors({
        raw: true
      });
      const rootAncestor = _.orderBy(ancestors, ["hierarchyLevel"], ["asc"])[0];
      const ancestry = await ProjectSurveyComment.findOneThreadByRootId(
        rootAncestor ? rootAncestor.id : comment.id
      );
      res.send(ancestry);
    }
  } catch (err) {
    next(err);
  }
});

router.post(
  "/comment/verify",
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
