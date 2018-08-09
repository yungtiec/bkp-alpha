const router = require("express").Router({ mergeParams: true });
const db = require("../db");
const permission = require("../access-control")["Disclosure"];
const {
  User,
  Project,
  ProjectSurvey,
  Survey,
  SurveyQuestion,
  ProjectSurveyAnswer,
  Notification,
  Question,
  SurveyCollaborator,
  Issue,
  ProjectAdmin,
  ProjectEditor
} = require("../db/models");
const moment = require("moment");
const _ = require("lodash");
const {
  ensureAuthentication,
  ensureResourceAccess,
  getEngagedUsers
} = require("./utils");
const MarkdownParsor = require("../../script/markdown-parser");
Promise = require("bluebird");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const { count, surveys } = await Survey.getSurveysWithStats({
      limit: req.query.limit,
      offset: req.query.offset
    });
    res.send({ count, surveys });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      createNewProjectSurvey({
        markdown: req.body.markdown,
        collaboratorEmails: req.body.collaboratorEmails.map(
          emailOption => emailOption.value
        ),
        commentPeriodUnit: req.body.commentPeriodUnit,
        commentPeriodValue: req.body.commentPeriodValue,
        selectedProjectSymbol: req.body.selectedProjectSymbol,
        scorecard: req.body.scorecard,
        creator: req.user,
        res,
        next
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:surveyId/upvote",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      if (req.body.hasDownvoted)
        await req.user.removeDownvotedSurveys(req.params.surveyId);
      if (!req.body.hasUpvoted) {
        await req.user.addUpvotedSurveys(req.params.surveyId);
      } else {
        await req.user.removeUpvotedSurveys(req.params.surveyId);
      }
      const [upvotesFrom, downvotesFrom] = await Survey.findById(
        req.params.surveyId
      ).then(ps => Promise.all([ps.getUpvotesFrom(), ps.getDownvotesFrom()]));
      res.send([upvotesFrom, downvotesFrom]);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:surveyId/downvote",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      if (req.body.hasUpvoted)
        await req.user.removeUpvotedSurveys(req.params.surveyId);
      if (!req.body.hasDownvoted) {
        await req.user.addDownvotedSurveys(req.params.surveyId);
      } else {
        await req.user.removeDownvotedSurveys(req.params.surveyId);
      }
      const [upvotesFrom, downvotesFrom] = await Survey.findById(
        req.params.surveyId
      ).then(ps => Promise.all([ps.getUpvotesFrom(), ps.getDownvotesFrom()]));
      res.send([upvotesFrom, downvotesFrom]);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:parentProjectSurveyId",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      updateExistingProjectSurvey({
        parentProjectSurveyId: req.params.parentProjectSurveyId,
        markdown: req.body.markdown,
        resolvedIssueIds: req.body.resolvedIssueIds,
        newIssues: req.body.newIssues,
        collaboratorEmails: req.body.collaboratorEmails.map(
          emailOption => emailOption.value
        ),
        commentPeriodUnit: req.body.commentPeriodUnit,
        commentPeriodValue: req.body.commentPeriodValue,
        scorecard: req.body.scorecard,
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
  commentPeriodUnit,
  commentPeriodValue,
  selectedProjectSymbol,
  scorecard,
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
      title: markdownParsor.title,
      creator_id: creator.id,
      project_id: project.id,
      latest_version: 1
    });
    var commentUntilInUnix = moment()
      .add(commentPeriodValue, commentPeriodUnit)
      .format("x");
    var projectSurvey = await ProjectSurvey.create({
      survey_id: survey.id,
      creator_id: creator.id,
      comment_until_unix: commentUntilInUnix,
      scorecard
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
          SurveyCollaborator.create({
            user_id: user ? user.id : null,
            email,
            survey_id: survey.id
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
  commentPeriodValue,
  commentPeriodUnit,
  scorecard,
  creator,
  res,
  next
}) {
  try {
    var parentProjectSurvey = await ProjectSurvey.scope({
      method: ["byIdWithMetadata", Number(parentProjectSurveyId)]
    }).findOne();
    var project = await Project.findOne({
      where: { symbol: parentProjectSurvey.survey.project.symbol },
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
      { project, disclosure: parentProjectSurvey.survey },
      creator
    );
    if (!canVersion) {
      res.sendStatus(403);
      return;
    }
    var markdownParsor = new MarkdownParsor({ markdown: markdown });
    var commentUntilInUnix = moment()
      .add(commentPeriodValue, commentPeriodUnit)
      .format("x");
    var projectSurvey = await ProjectSurvey.create({
      survey_id: parentProjectSurvey.survey.id,
      creator_id: creator.id,
      comment_until_unix: commentUntilInUnix,
      scorecard
    });
    await parentProjectSurvey.addChild(projectSurvey.id);
    var survey = await Survey.findById(parentProjectSurvey.survey.id).then(s =>
      s.update({ latest_version: parentProjectSurvey.hierarchyLevel + 1 })
    );
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
            project_survey_id: projectSurvey.id,
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
    var prevCollaboratorEmails = parentProjectSurvey.survey.collaborators.map(
      user => user.email
    );
    var removedCollaborators = _.difference(
      prevCollaboratorEmails,
      collaboratorEmails
    ).map(async email =>
      SurveyCollaborator.update(
        { revoked_access: true },
        {
          where: {
            email,
            survey_id: parentProjectSurvey.survey.id
          }
        }
      )
    );
    var collaborators = collaboratorEmails.map(
      async email =>
        await User.findOne({ where: { email } }).then(user =>
          SurveyCollaborator.findOrCreate({
            where: {
              user_id: user.id,
              survey_id: parentProjectSurvey.survey.id
            },
            defaults: {
              user_id: user ? user.id : null,
              email,
              survey_id: parentProjectSurvey.survey.id,
              project_survey_version: projectSurvey.hierarchyLevel
            }
          }).then(async (collaborator, created) => {
            var updated;
            if (collaborator.revoked_access) {
              collaborator = await SurveyCollaborator.update(
                {
                  revoked_access: false
                },
                { where: { id: collaborator.id } }
              );
              updated = true;
            }
            if (created || updated)
              return Notification.notifyCollaborators({
                sender: creator,
                collaboratorId: user.id,
                projectSurveyId: projectSurvey.id,
                projectSymbol: project.symbol,
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
        owner_id: creator.id
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
        .concat(removedCollaborators)
        .concat(resolvedCurrentIssues)
        .concat(resolvedAddedIssues)
        .concat(
          engagedUsers.map(engagedUser =>
            Notification.notifyEngagedUserOnUpdate({
              engagedUser,
              projectSurveyId: projectSurvey.id,
              projectSymbol: project.symbol,
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
