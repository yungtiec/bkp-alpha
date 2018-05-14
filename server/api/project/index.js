const router = require("express").Router();
const db = require("../../db");
const {
  Annotation,
  User,
  Role,
  Tag,
  ProjectSurveyComment,
  Issue,
  Project,
  ProjectSurvey,
  Survey,
  Question,
  SurveyQuestion,
  ProjectSurveyAnswer
} = require("../../db/models");
const _ = require("lodash");
const { ensureAuthentication, ensureAdminRole } = require("../utils");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
module.exports = router;

router.use("/survey/comment", require("./comment"));
router.use("/survey", require("./survey"));

router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.getProjects();
    res.send(projects);
  } catch (err) {
    next(err);
  }
});

router.get("/:symbol", async (req, res, next) => {
  try {
    const project = await Project.getProjectWithStats(req.params.symbol);
    res.send(project);
  } catch (err) {
    next(err);
  }
});
