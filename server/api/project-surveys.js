const router = require("express").Router({ mergeParams: true });
const db = require("../db");
const { Project, ProjectSurvey } = require("../db/models");
Promise = require("bluebird");
module.exports = router;

router.get("/:id/metadata", async (req, res, next) => {
  try {
    const projectSurvey = await ProjectSurvey.scope({
      method: ["byIdWithMetadata", req.params.id]
    }).findOne();
    res.send(projectSurvey);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/questions", async (req, res, next) => {
  try {
    const projectSurvey = await ProjectSurvey.scope({
      method: ["byIdWithSurveyQuestions", req.params.id]
    }).findOne();
    res.send(projectSurvey);
  } catch (err) {
    next(err);
  }
});
