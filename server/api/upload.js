const router = require("express").Router();
const db = require("../db");
const _ = require("lodash");
const {
  Comment,
  User,
  ProjectSurvey,
  Survey,
  SurveyQuestion,
  ProjectSurveyAnswer,
  Notification,
  Question,
  Collaborator,
  Issue,
  ProjectSurveyComment
} = require("../db/models");
const {
  ensureAuthentication,
  ensureAdminRole,
  ensureAdminRoleOrAnnotationOwnership,
  ensureResourceAccess,
  getEngagedUsers
} = require("./utils");
const MarkdownParsor = require("../../script/markdown-parser");
Promise = require("bluebird");
module.exports = router;

function hasEditRight(userId, parentProjectSurvey) {
  const isOwner = userId === parentProjectSurvey.creator.id;
  const isCollaborator = parentProjectSurvey.collaborators.reduce(
    (bool, c) => c.id === userId,
    false
  );
  return isOwner || isCollaborator;
}

router.post(
  "/:parentProjectSurveyId",
  ensureAuthentication,
  async (req, res, next) => {
    try {
      var uploader = await User.findById(req.user.id);
      var markdownParsor = new MarkdownParsor({ markdown: req.body.markdown });
      var survey = await Survey.create({
        title: markdownParsor.title
      });
      var parentProjectSurvey = await ProjectSurvey.scope({
        method: ["byProjectSurveyId", Number(req.params.parentProjectSurveyId)]
      }).findOne();

      if (!hasEditRight(req.user.id, parentProjectSurvey)) res.sendStatus(401);
      else {
        var projectSurvey = await ProjectSurvey.create({
          project_id: parentProjectSurvey.project.id,
          survey_id: survey.id,
          creator_id: req.user.id,
          forked: req.user.id !== parentProjectSurvey.creator_id,
          original_id:
            req.user.id !== parentProjectSurvey.creator_id
              ? parentProjectSurvey.id
              : null
        });
        if (req.user.id === parentProjectSurvey.creator_id)
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
        var collaborators = req.body.collaboratorEmails.map(
          async email =>
            await User.findOne({ where: { email } }).then(user =>
              Collaborator.create({
                user_id: user ? user.id : null,
                email,
                project_survey_id: projectSurvey.id
              }).then(collaborator => {
                return Notification.notifyCollaborators({
                  sender: uploader,
                  collaboratorId: user.id,
                  projectSurveyId: projectSurvey.id,
                  projectSymbol: parentProjectSurvey.project.symbol,
                  parentSurveyTitle: parentProjectSurvey.survey.title
                });
              })
            )
        );
        var resolvedCurrentIssues = req.body.resolvedIssueIds.map(
          async issueId =>
            Issue.update(
              { open: false, resolving_project_survey_id: projectSurvey.id },
              { where: { id: Number(issueId) } }
            )
        );
        var resolvedAddedIssues = req.body.newIssues.map(async newIssue =>
          Comment.create({
            comment: newIssue,
            reviewed: "verified",
            project_survey_id: req.params.parentProjectSurveyId,
            owner_id: req.user.id
          }).then(comment =>
            Issue.create({
              open: false,
              comment_id: comment.id,
              resolving_project_survey_id: projectSurvey.id
            })
          )
        );
        var engagedUsers = await getEngagedUsers(parentProjectSurvey);
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
      }
    } catch (err) {
      next(err);
    }
  }
);
