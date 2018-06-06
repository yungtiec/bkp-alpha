const router = require("express").Router();
const {
  User,
  Role,
  Annotation,
  ProjectSurveyComment,
  ProjectSurvey,
  Project,
  Tag,
  Issue,
  Notification,
  Survey
} = require("../db/models");
const {
  ensureAuthentication,
  ensureAdminRole,
  ensureAdminRoleOrEngagementItemOwnership
} = require("./utils");
Promise = require("bluebird");
module.exports = router;

router.get(
  "/users",
  ensureAuthentication,
  ensureAdminRole,
  async (req, res, next) => {
    try {
      const users = await User.getUserListWithContributions();
      res.send(users);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/user/access",
  ensureAuthentication,
  ensureAdminRole,
  async (req, res, next) => {
    try {
      const user = await User.update(
        {
          restricted_access: req.body.accessStatus === "restricted"
        },
        {
          where: { id: req.body.userId }
        }
      );
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/project-survey/:projectSurveyId",
  ensureAuthentication,
  ensureAdminRole,
  async (req, res, next) => {
    try {
      var annotations = await Annotation.findAll({
        where: {
          project_survey_id: req.params.projectSurveyId
        },
        include: [
          {
            model: User,
            as: "owner"
          },
          {
            model: Tag,
            required: false
          },
          {
            model: Annotation,
            as: "ancestors",
            required: false,
            include: [
              {
                model: User,
                as: "owner"
              },
              {
                model: Tag,
                required: false
              },
              {
                model: Issue,
                required: false
              }
            ]
          },
          {
            model: Issue,
            required: false
          },
          {
            model: ProjectSurvey,
            attributes: ["id"],
            include: [
              {
                model: Project
              },
              {
                model: Survey
              }
            ]
          }
        ],
        order: [
          [
            {
              model: Annotation,
              as: "ancestors"
            },
            "hierarchyLevel"
          ]
        ]
      });
      res.send(annotations);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/comment/verify",
  ensureAuthentication,
  ensureAdminRole,
  async (req, res, next) => {
    try {
      var comment = await Annotation.findById(req.body.comment.id);
      comment.update({ reviewed: req.body.reviewed });
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/comment/issue",
  ensureAuthentication,
  ensureAdminRoleOrEngagementItemOwnership,
  async (req, res, next) => {
    try {
      var comment = await Annotation.findOne({
        where: { id: req.body.comment.id },
        include: [
          {
            model: Issue
          }
        ]
      });
      if (!req.body.open) {
        await Notification.notify({
          sender: "",
          engagementItem: comment,
          messageFragment: "Admin closed your issue."
        });
      }
      comment.issue
        ? await Issue.update(
            {
              open: req.body.open
            },
            {
              where: { id: comment.issue.id }
            }
          )
        : Issue.create({
            open: req.body.open,
            annotation_id: req.body.comment.id
          });
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);
