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
    const admins = await Role.findOne({
      where: { name: "admin" }
    }).then(role => role.getUsers());
    const project = await Project.getProjectWithStats(req.params.symbol);
    const collaboratorOptions = admins
      .concat(project.admins || [])
      .concat(project.editors || [])
      .filter(c => c.id !== req.user.id);
    res.send(_.assignIn(project, { collaboratorOptions }));
  } catch (err) {
    next(err);
  }
});

router.use("/:symbol/surveys", require("./surveys"));
router.use("/:symbol/surveys/:projectSurveyId/comments", require("./comments"));
router.use(
  "/:symbol/surveys/:projectSurveyId/annotator",
  require("./annotator")
);
