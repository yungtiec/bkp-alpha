const router = require("express").Router();
const db = require("../db");
const _ = require("lodash");
const {
  Annotation,
  User,
  ProjectSurvey,
  Survey,
  SurveyQuestion,
  ProjectSurveyAnswer,
  Notification,
  Question
} = require("../db/models");
const {
  ensureAuthentication,
  ensureAdminRole,
  ensureAdminRoleOrAnnotationOwnership,
  ensureResourceAccess
} = require("./utils");
const MarkdownParsor = require("../../script/markdown-parser");
Promise = require("bluebird");
module.exports = router;

router.post("/", (req, res, next) => {
  // upload new disclosure brand new
});

router.post("/:parentProjectSurveyId", async (req, res, next) => {
  try {
    var parentProjectSurvey = await ProjectSurvey.scope({
      method: ["byProjectSurveyId", Number(req.params.parentProjectSurveyId)]
    }).findOne();
    var markdownParsor = new MarkdownParsor({ markdown: req.body.markdown });
    var survey = await Survey.create({
      title: markdownParsor.title
    });
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
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});
