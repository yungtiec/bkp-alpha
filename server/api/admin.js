const router = require("express").Router();
const {
  User,
  Role,
  Annotation,
  ProjectSurveyComment,
  ProjectSurvey,
  Project,
  Tag,
  Issue
} = require("../db/models");
const {
  ensureAuthentication,
  ensureAdminRole,
  ensureAdminRoleOrAnnotationOwnership
} = require("./utils");
Promise = require("bluebird");
module.exports = router;

router.get(
  "/project-survey/:projectSurveyId",
  ensureAuthentication,
  ensureAdminRole,
  async (req, res, next) => {
    try {
      var [annotations, pageComments] = await Promise.all([
        Annotation.findAll({
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
        }),
        ProjectSurveyComment.findAll({
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
              model: ProjectSurveyComment,
              as: "parent",
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
                  model: Project,
                  attributes: ["symbol"]
                }
              ]
            }
          ]
        })
      ]);
      res.send(annotations.concat(pageComments));
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
  ensureAdminRoleOrAnnotationOwnership,
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
        engagementItem = await ProjectSurveyComment.findOne({
          where: { id: req.body.engagementItem.id },
          include: [
            {
              model: Issue
            }
          ]
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
