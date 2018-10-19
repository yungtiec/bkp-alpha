const {
  User,
  Role,
  Project,
  ProjectEditor,
  ProjectAdmin
} = require("../../db/models");
const _ = require("lodash");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.getProjects();
    res.send(projects);
  } catch (err) {
    next(err);
  }
};

const getProject = async (req, res, next) => {
  try {
    const admins = await Role.findOne({
      where: { name: "admin" }
    }).then(role => role.getUsers());
    const project = await Project.getProjectWithStats(req.params.symbol);
    const collaboratorOptions =
      req.user && req.user.id
        ? admins
            .concat(project.admins || [])
            .concat(project.editors || [])
            .filter(c => c.id !== req.user.id)
        : [];
    res.send(project);
  } catch (err) {
    next(err);
  }
};

const searchProject = async (req, res, next) => {
  try {
    var formattedQuery = !req.query.q
      ? null
      : req.query.q
          .trim()
          .split(" ")
          .map(function(phrase) {
            return "%" + phrase + "%";
          })
          .join("");
    var queryObj = !req.query.formatted
      ? {
          where: {
            [Op.or]: [{ name: { $ne: null } }, { symbol: { $ne: null } }]
          }
        }
      : {
          where: {
            [Op.or]: [
              { name: { $iLike: req.query.formatted } },
              { symbol: { $iLike: req.query.formatted } }
            ]
          }
        };
    var projects = await Project.findAll(queryObj);
    res.send(projects.filter(p => p.symbol !== "BKP"));
  } catch (err) {
    next(err);
  }
};

const getProjectCollaboratorOptions = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: { symbol: req.params.symbol }
    });
    const [projectAdmins, projectEditors, admins] = await Promise.all([
      project.getAdmins(),
      project.getEditors(),
      Role.findOne({
        where: { name: "admin" }
      }).then(role => role.getUsers())
    ]);
    const collaboratorOptions =
      req.user && req.user.id
        ? admins
            .concat(project.admins || [])
            .concat(project.editors || [])
            .filter(c => c.id !== req.user.id)
        : [];
    res.send(collaboratorOptions);
  } catch (err) {
    next(err);
  }
};

const postProjectEditors = async (req, res, next) => {
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
};

const deleteProjectEditor = async (req, res, next) => {
  try {
    await ProjectEditor.findById(Number(req.params.projectEditorId)).then(e =>
      e.destroy()
    );
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProjects,
  getProject,
  searchProject,
  getProjectCollaboratorOptions,
  postProjectEditors,
  deleteProjectEditor
};
