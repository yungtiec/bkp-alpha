const router = require("express").Router({ mergeParams: true });
const db = require("../../db");
const permission = require("../../access-control")["Disclosure"];
const {
  Comment,
  User,
  Project,
  ProjectSurvey,
  Survey,
  SurveyQuestion,
  ProjectSurveyAnswer,
  Notification,
  Question,
  SurveyCollaborator,
  Issue,
  ProjectSurveyComment,
  ProjectAdmin,
  ProjectEditor
} = require("../../db/models");
const moment = require("moment");
const _ = require("lodash");
const {
  ensureAuthentication,
  ensureResourceAccess,
  getEngagedUsers
} = require("../utils");
const MarkdownParsor = require("../../../script/markdown-parser");
Promise = require("bluebird");
module.exports = router;

router.get("/:projectSurveyId", async (req, res, next) => {
  try {
    const projectSurvey = await ProjectSurvey.scope({
      method: ["byIdWithMetadata", req.params.projectSurveyId]
    }).findOne();
    res.send(projectSurvey);
  } catch (err) {
    next(err);
  }
});

router.get("/:rootProjectSurveyId/issues", async (req, res, next) => {
  try {
    const projectSurvey = await Project.getOutstandingIssuesByVersion(
      req.params.rootProjectSurveyId
    );
    res.send(projectSurvey);
  } catch (err) {
    next(err);
  }
});
