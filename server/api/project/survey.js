const router = require("express").Router();
const db = require("../../db");
const {
  User,
  ProjectSurvey,
  Survey,
  Question,
  SurveyQuestion,
  ProjectSurveyAnswer
} = require("../../db/models");
const _ = require("lodash");
const { ensureAuthentication, ensureAdminRole } = require("../utils");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const projectSurveys = await ProjectSurvey.getPublishedSurveysWithStats()
    res.send(projectSurveys)
  } catch (err) {
    next(err);
  }
});

router.get("/:projectSurveyId", async (req, res, next) => {
  try {
    const projectSurvey = await ProjectSurvey.scope({
      method: ["byProjectSurveyId", req.params.projectSurveyId]
    }).findOne();
    res.send(projectSurvey);
  } catch (err) {
    next(err);
  }
});
