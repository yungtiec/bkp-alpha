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
  ProjectEditor,
  ProjectAdmin,
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

router.post("/:symbol/editors", async (req, res, next) => {
  try {
    var candidate = await User.findOne({
      where: { email: req.body.editorEmail },
      include: [
        {
          model: Role
        }
      ]
    });
    if (!candidate) {
      res.sendStatus(404);
      return;
    }
    var project = await Project.findOne({
      where: { symbol: req.params.symbol }
    });
    var projectAdmin;
    if (!candidate.roles || !candidate.roles.length) {
      await Role.findOne({
        where: { name: "project_editor" }
      }).then(r => candidate.addRole(r.id));
    } else if (candidate.roles[0].name === "project_admin") {
      projectAdmin = await ProjectAdmin.findOne({
        where: { user_id: candidate.id, project_id: project.id }
      });
    } else if (candidate.roles[0].name === "admin") {
      res.status(500).send({
        message: `${req.body.editorEmail} is one of the system admins.`
      });
    }
    if (projectAdmin) {
      res.status(500).send({
        message: `${req.body.editorEmail} is a project admin already.`
      });
      return;
    }
    await ProjectEditor.findOrCreate({
      where: { user_id: candidate.id, project_id: project.id },
      defaults: { user_id: candidate.id, project_id: project.id }
    });
    candidate = await User.findOne({
      where: { email: req.body.editorEmail },
      include: [
        {
          model: Role
        }
      ]
    });
    res.send(candidate);
  } catch (err) {
    next(err);
  }
});

router.delete("/:symbol/editors/:projectEditorId", async (req, res, next) => {
  try {
    await ProjectEditor.findById(Number(req.params.projectEditorId)).then(e =>
      e.destroy()
    );
    res.sendStatus(200);
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
