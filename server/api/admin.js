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

router.post(
  "/comment/verify",
  ensureAuthentication,
  ensureAdminRole,
  async (req, res, next) => {
    try {
      var comment = await Comment.findById(req.body.comment.id);
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
  ensureAdminRoleOrCommentOwnership,
  async (req, res, next) => {
    try {
      var comment = await Comment.findOne({
        where: { id: req.body.comment.id },
        include: [
          {
            model: Issue
          },
          {
            model: ProjectSurvey,
            include: [
              {
                model: Project,
                attributes: ["symbol"]
              }
            ]
          }
        ]
      });
      if (!req.body.open && req.user.id !== comment.owner_id) {
        await Notification.notify({
          sender: "",
          comment,
          messageFragment: "Admin closed your issue."
        });
      }
      if (req.body.open && req.user.id !== comment.owner_id) {
        await Notification.notify({
          sender: "",
          comment,
          messageFragment: "Admin opened an issue on your comment."
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
            comment_id: req.body.comment.id
          });
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);
