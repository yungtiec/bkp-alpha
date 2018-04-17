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
