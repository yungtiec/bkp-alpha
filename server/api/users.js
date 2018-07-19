const Sequelize = require("sequelize");
const _ = require("lodash");
const db = require("../db");
const router = require("express").Router();
const {
  User,
  Role,
  Annotation,
  Project,
  Survey,
  Comment,
  Issue
} = require("../db/models");
const { assignIn } = require("lodash");
const { ensureAuthentication } = require("./utils");
module.exports = router;

const ensureCorrectRole = (req, res, next) => {
  if (
    !req.user.roles ||
    !req.user.roles.length ||
    req.user.roles[0].name === "user"
  ) {
    res.send([]);
    return;
  } else {
    next();
  }
};

router.get("/", ensureAuthentication, async (req, res, next) => {
  try {
    const users = await User.getUserListWithContributions({ limit: 20 });
    res.send(users);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:userId",
  ensureAuthentication,
  // nothing senstiive here, we can let users decide what to diclose in their profile later on
  async (req, res, next) => {
    try {
      const profile = await User.getContributions({
        userId: Number(req.params.userId)
      });
      res.send(profile);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:userId/projects",
  ensureAuthentication,
  ensureCorrectRole,
  async (req, res, next) => {
    try {
      var includeQuery = {
        include: [
          {
            model: db.model("user"),
            through: db.model("project_admin"),
            as: "admins"
          },
          {
            model: db.model("user"),
            through: db.model("project_editor"),
            as: "editors"
          }
        ]
      };
      var projects;
      var managedProjects, editedProjects;
      var admins = (admins = await Role.findOne({
        where: { name: "admin" }
      }).then(role => role.getUsers()));
      switch (req.user.roles[0].name) {
        case "admin":
          projects = await Project.getProjects();
          break;
        case "project_admin":
          managedProjects = await req.user.getManagedProjects(includeQuery);
          editedProjects = await req.user.getEditedProjects(includeQuery);
          projects = editedProjects.concat(managedProjects);
          break;
        case "project_editor":
          projects = await req.user.getEditedProjects(includeQuery);
          break;
      }
      projects = projects.map(p => {
        const collaboratorOptions = admins
          .concat(p.admins || [])
          .concat(p.editors || [])
          .filter(c => c.id !== req.user.id);
        return _.assignIn(p.toJSON(), { collaboratorOptions });
      });
      res.send(projects);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:userId/surveys",
  ensureAuthentication,
  ensureCorrectRole,
  async (req, res, next) => {
    try {
      var surveys;
      var ownSurveys, collaboratorSurveys;
      switch (req.user.roles[0].name) {
        case "admin":
          surveys = await Survey.scope("allRootsWithDescendants").findAll();
          break;
        case "project_admin":
        case "project_editor":
          ownSurveys = await Survey.scope("allRootsWithDescendants").findAll({
            where: { creator_id: req.user.id }
          });
          collaboratorSurveys = await req.user.getCollaboratedSurveys({
            include: [
              { model: db.model("project_survey") },
              {
                model: db.model("project")
              }
            ],
            order: [
              ["createdAt", "DESC"],
              [{ model: db.model("project_survey") }, "hierarchyLevel", "DESC"]
            ]
          });
          surveys = ownSurveys.concat(collaboratorSurveys);
          break;
        default:
          surveys = [];
          break;
      }
      res.send(surveys);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:userId/comments",
  ensureAuthentication,
  // nothing senstiive here, we can let users decide what to diclose in their profile later on
  async (req, res, next) => {
    var queryObj = {
      userId: Number(req.params.userId),
      limit: Number(req.query.limit),
      offset: Number(req.query.limit) * Number(req.query.offset),
      reviewStatus: {
        [Sequelize.Op.or]: [
          { [Sequelize.Op.eq]: "pending" },
          { [Sequelize.Op.eq]: "verified" },
          { [Sequelize.Op.eq]: "spam" }
        ]
      }
    };
    if (req.query.reviewStatus && req.query.reviewStatus.length) {
      queryObj.reviewStatus = {
        [Sequelize.Op.or]: req.query.reviewStatus.map(status => ({
          [Sequelize.Op.eq]: status
        }))
      };
    }
    if (req.query.projects && req.query.projects.length) {
      queryObj.projects = {
        [Sequelize.Op.or]: req.query.projects.map(jsonString => ({
          [Sequelize.Op.eq]: JSON.parse(jsonString).value
        }))
      };
    }
    if (req.query.issueStatus && req.query.issueStatus.length) {
      queryObj.issueStatus = {
        [Sequelize.Op.or]: req.query.issueStatus.map(status => ({
          [Sequelize.Op.eq]: status === "open"
        }))
      };
    }
    try {
      const { comments, commentCount } = await User.getCommentsAndCount(
        queryObj
      );
      res.send({ comments: pagedComments, commentCount: commentCount });
    } catch (err) {
      next(err);
    }
  }
);
