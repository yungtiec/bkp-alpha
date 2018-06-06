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
  "/engagement-item/verify",
  ensureAuthentication,
  ensureAdminRole,
  async (req, res, next) => {
    try {
      var engagementItem;
      if (req.body.engagementItem.engagementItemType === "annotation") {
        engagementItem = await Annotation.findById(req.body.engagementItem.id);
      } else if (
        req.body.engagementItem.engagementItemType === "page_comment"
      ) {
        engagementItem = await ProjectSurveyComment.findById(
          req.body.engagementItem.id
        );
      }
      engagementItem.update({ reviewed: req.body.reviewed });
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/engagement-item/issue",
  ensureAuthentication,
  ensureAdminRoleOrEngagementItemOwnership,
  async (req, res, next) => {
    try {
      var engagementItem;
      if (req.body.engagementItem.engagementItemType === "annotation") {
        engagementItem = await Annotation.findOne({
          where: { id: req.body.engagementItem.id },
          include: [
            {
              model: Issue
            }
          ]
        });
      } else if (
        req.body.engagementItem.engagementItemType === "page_comment"
      ) {
        engagementItem = await ProjectSurveyComment.scope({
          method: [
            "withProjectSurveyInfo",
            { where: { id: req.body.engagementItem.id } }
          ]
        });
      }
      if (!req.body.open) {
        await Notification.notify({
          sender: "",
          engagementItem: engagementItem,
          messageFragment: "Admin closed your issue."
        });
      }
      engagementItem.issue
        ? await Issue.update(
            {
              open: req.body.open
            },
            {
              where: { id: engagementItem.issue.id }
            }
          )
        : req.body.engagementItem.engagementItemType === "annotation"
          ? await Issue.create({
              open: req.body.open,
              annotation_id: req.body.engagementItem.id
            })
          : await Issue.create({
              open: req.body.open,
              project_survey_comment_id: req.body.engagementItem.id
            });
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);
