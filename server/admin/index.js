const router = require("express").Router();
const {
  User,
  Role,
  Comment,
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
  ensureAdminRoleOrCommentOwnership
} = require("../api/utils");
Promise = require("bluebird");
module.exports = router;

router.get(
  "/users",
  ensureAuthentication,
  ensureAdminRole,
  async (req, res, next) => {
    try {
      const users = await User.getUserListWithContributions({});
      res.send(users);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/users/:userId/access",
  ensureAuthentication,
  ensureAdminRole,
  async (req, res, next) => {
    try {
      const user = await User.update(
        {
          restricted_access: req.body.accessStatus === "restricted"
        },
        {
          where: { id: req.params.userId }
        }
      );
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/projects/:projectSymbol/surveys/:projectSurveyId/comments",
  ensureAuthentication,
  ensureAdminRole,
  async (req, res, next) => {
    try {
      var comments = await Comment.findAll({
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
            model: Comment,
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
              model: Comment,
              as: "ancestors"
            },
            "hierarchyLevel"
          ]
        ]
      });
      res.send(comments);
    } catch (err) {
      next(err);
    }
  }
);
