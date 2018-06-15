const router = require("express").Router({ mergeParams: true });
const db = require("../../db");
const permission = require("../../access-control")["Disclosure"];
const {
  Comment,
  User,
  Project,
  ProjectSurvey,
  Survey,
  SurveyQuestion,
  ProjectSurveyAnswer,
  Notification,
  Question,
  Collaborator,
  Issue,
  ProjectSurveyComment,
  ProjectAdmin,
  ProjectEditor
} = require("../../db/models");
const moment = require("moment");
const _ = require("lodash");
const {
  ensureAuthentication,
  ensureResourceAccess,
  getEngagedUsers
} = require("../utils");
const MarkdownParsor = require("../../../script/markdown-parser");
Promise = require("bluebird");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const projectSurveys = await ProjectSurvey.getAllPublishedSurveysWithStats();
    res.send(projectSurveys);
  } catch (err) {
    next(err);
  }
});

router.get("/latest", async (req, res, next) => {
  try {
    const projectSurveys = await ProjectSurvey.getLatestPublishedSurveysWithStats();
    res.send(projectSurveys);
  } catch (err) {}
});

router.get("/:projectSurveyId", async (req, res, next) => {
  try {
    const projectSurvey = await ProjectSurvey.scope({
      method: ["byProjectSurveyId", req.params.projectSurveyId]
    }).findOne();
    res.send(projectSurvey);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/:parentProjectSurveyId",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      if (req.params.parentProjectSurveyId === "-")
        createNewProjectSurvey({
          markdown: req.body.markdown,
          collaboratorEmails: req.body.collaboratorEmails,
          commentPeriodInDay: req.body.commentPeriodInDay,
          selectedProjectSymbol: req.body.selectedProjectSymbol,
          creator: req.user,
          res,
          next
        });
      else
        updateExistingProjectSurvey({
          parentProjectSurveyId: req.params.parentProjectSurveyId,
          markdown: req.body.markdown,
          resolvedIssueIds: req.body.resolvedIssueIds,
          newIssues: req.body.newIssues,
          collaboratorEmails: req.body.collaboratorEmails,
          commentPeriodInDay: req.body.commentPeriodInDay,
          creator: req.user,
          res,
          next
        });
    } catch (err) {
      next(err);
    }
  }
);

async function createNewProjectSurvey({
  markdown,
  collaboratorEmails,
  commentPeriodInDay,
  selectedProjectSymbol,
  creator,
  res,
  next
}) {
  try {
    var project = await Project.findOne({
      where: { symbol: selectedProjectSymbol },
      include: [
        {
          model: User,
          through: ProjectAdmin,
          as: "admins"
        },
        {
          model: User,
          through: ProjectEditor,
          as: "editors"
        }
      ]
    });
    const canCreate = permission("Create", { project }, creator);
    if (!canCreate) {
      res.sendStatus(403);
      return;
    }
    var markdownParsor = new MarkdownParsor({ markdown: markdown });
    var survey = await Survey.create({
      title: markdownParsor.title
    });
    var commentUntilInUnix = moment()
      .add(commentPeriodInDay, "days")
      .format("x");
    var projectSurvey = await ProjectSurvey.create({
      project_id: project.id,
      survey_id: survey.id,
      creator_id: creator.id,
      comment_until_unix: commentUntilInUnix
    });
    var questionInstances = await Promise.map(
      markdownParsor.questions,
      questionObject =>
        Question.findOrCreate({
          where: {
            markdown: `### ${questionObject.question.trim()}`
          },
          defaults: {
            markdown: `### ${questionObject.question.trim()}`
          }
        }).spread(async (question, created) => {
          var answer = markdownParsor.findAnswerToQuestion(
            questionObject.order_in_survey
          );
          var surveyQuestion = await SurveyQuestion.create({
            survey_id: survey.id,
            question_id: question.id,
            order_in_survey: questionObject.order_in_survey
          });
          await ProjectSurveyAnswer.create({
            markdown: answer,
            survey_question_id: surveyQuestion.id,
            project_survey_id: projectSurvey.id
          });
          return question;
        })
    );
    var collaborators = collaboratorEmails.map(
      async email =>
        await User.findOne({ where: { email } }).then(user =>
          Collaborator.create({
            user_id: user ? user.id : null,
            email,
            project_survey_id: projectSurvey.id
          }).then(collaborator => {
            return Notification.notifyCollaborators({
              sender: creator,
              collaboratorId: user.id,
              projectSurveyId: projectSurvey.id,
              projectSymbol: project.symbol,
              parentSurveyTitle: survey.title,
              action: "created"
            });
          })
        )
    );
    res.send(projectSurvey);
  } catch (err) {
    next(err);
  }
}

async function updateExistingProjectSurvey({
  parentProjectSurveyId,
  markdown,
  resolvedIssueIds,
  newIssues,
  collaboratorEmails,
  commentPeriodInDay,
  creator,
  res,
  next
}) {
  try {
    var parentProjectSurvey = await ProjectSurvey.scope({
      method: ["byProjectSurveyId", Number(parentProjectSurveyId)]
    }).findOne();
    var project = await Project.findOne({
      where: { symbol: parentProjectSurvey.project.symbol },
      include: [
        {
          model: User,
          through: ProjectAdmin,
          as: "admins"
        },
        {
          model: User,
          through: ProjectEditor,
          as: "editors"
        }
      ]
    });
    const canVersion = permission(
      "Version",
      { project, disclosure: parentProjectSurvey },
      creator
    );
    if (!canVersion) {
      res.sendStatus(403);
      return;
    }
    var markdownParsor = new MarkdownParsor({ markdown: markdown });
    var survey = await Survey.create({
      title: markdownParsor.title
    });
    var commentUntilInUnix = moment()
      .add(commentPeriodInDay, "days")
      .format("x");

    var projectSurvey = await ProjectSurvey.create({
      project_id: parentProjectSurvey.project.id,
      survey_id: survey.id,
      creator_id: creator.id,
      forked: creator.id !== parentProjectSurvey.creator_id,
      original_id:
        creator.id !== parentProjectSurvey.creator_id
          ? parentProjectSurvey.id
          : null,
      comment_until_unix: commentUntilInUnix
    });
    if (creator.id === parentProjectSurvey.creator_id)
      await parentProjectSurvey.addChild(projectSurvey.id);
    var questionInstances = await Promise.map(
      markdownParsor.questions,
      questionObject =>
        Question.findOrCreate({
          where: {
            markdown: `### ${questionObject.question.trim()}`
          },
          defaults: {
            markdown: `### ${questionObject.question.trim()}`
          }
        }).spread(async (question, created) => {
          var answer = markdownParsor.findAnswerToQuestion(
            questionObject.order_in_survey
          );
          var surveyQuestion = await SurveyQuestion.create({
            survey_id: survey.id,
            question_id: question.id,
            order_in_survey: questionObject.order_in_survey
          });
          await ProjectSurveyAnswer.create({
            markdown: answer,
            survey_question_id: surveyQuestion.id,
            project_survey_id: projectSurvey.id
          });
          return question;
        })
    );
    var collaborators = collaboratorEmails.map(
      async email =>
        await User.findOne({ where: { email } }).then(user =>
          Collaborator.create({
            user_id: user ? user.id : null,
            email,
            project_survey_id: projectSurvey.id
          }).then(collaborator => {
            return Notification.notifyCollaborators({
              sender: creator,
              collaboratorId: user.id,
              projectSurveyId: projectSurvey.id,
              projectSymbol: parentProjectSurvey.project.symbol,
              parentSurveyTitle: parentProjectSurvey.survey.title,
              action: "updated"
            });
          })
        )
    );
    var resolvedCurrentIssues = resolvedIssueIds.map(async issueId =>
      Issue.update(
        { open: false, resolving_project_survey_id: projectSurvey.id },
        { where: { id: Number(issueId) } }
      )
    );
    var resolvedAddedIssues = newIssues.map(async newIssue =>
      Comment.create({
        comment: newIssue,
        reviewed: "verified",
        project_survey_id: parentProjectSurveyId,
        owner_id: user.id
      }).then(comment =>
        Issue.create({
          open: false,
          comment_id: comment.id,
          resolving_project_survey_id: projectSurvey.id
        })
      )
    );
    var engagedUsers = await getEngagedUsers({
      projectSurvey: parentProjectSurvey,
      creator,
      collaboratorEmails
    });
    await Promise.all(
      collaborators
        .concat(resolvedCurrentIssues)
        .concat(resolvedAddedIssues)
        .concat(
          engagedUsers.map(engagedUser =>
            Notification.notifyEngagedUserOnUpdate({
              engagedUser,
              projectSurveyId: projectSurvey.id,
              projectSymbol: parentProjectSurvey.project.symbol,
              parentSurveyTitle: parentProjectSurvey.survey.title
            })
          )
        )
    );
    res.send(projectSurvey);
  } catch (err) {
    next(err);
  }
}
