const Sequelize = require("sequelize");
const db = require("../db");
const _ = require("lodash");

const Project = db.define(
  "project",
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    symbol: {
      type: Sequelize.STRING,
      unique: true
    },
    description: {
      type: Sequelize.TEXT
    },
    logo_url: {
      type: Sequelize.TEXT
    },
    website: {
      type: Sequelize.TEXT
    }
  },
  {
    scopes: {
      withStats: function(projectSymbol) {
        var query = {
          include: [
            {
              model: db.model("project_survey"),
              where: { submitted: true, reviewed: true },
              required: false,
              include: [
                { model: db.model("user"), as: "creator" },
                {
                  model: db.model("survey"),
                  include: [
                    {
                      model: db.model("survey_question"),
                      include: [
                        {
                          model: db.model("annotation"),
                          required: false,
                          attributes: ["id", "reviewed"],
                          include: [
                            {
                              model: db.model("issue"),
                              required: false
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  model: db.model("project_survey_comment"),
                  attributes: ["id", "reviewed"],
                  required: false,
                  include: [
                    {
                      model: db.model("issue"),
                      required: false
                    }
                  ]
                }
              ]
            }
          ]
        };
        if (projectSymbol) {
          query.where = { symbol: projectSymbol };
        }
        return query;
      }
    }
  }
);

Project.getProjectWithStats = async function(projectSymbol) {
  const projectInstance = await Project.scope({
    method: ["withStats", projectSymbol]
  }).findOne();
  return getProjectStats(projectInstance);
};

Project.getProjects = async function() {
  const projectInstances = await Project.scope("withStats").findAll();
  return Promise.map(projectInstances, i => getProjectStats(i));
};

module.exports = Project;

/**
 *
 * helpers
 *
 */

function getProjectStats(projectInstance) {
  const project = projectInstance.toJSON();
  const numSurveys = project.project_surveys.length;
  const numAnnotation = project.project_surveys
    .map(projectSurvey =>
      projectSurvey.survey.survey_questions.reduce(
        (count, surveyQuestion) =>
          surveyQuestion.annotations.filter(a => a.reviewed !== "spam").length +
          count,
        0
      )
    )
    .reduce((a, b) => a + b, 0);
  const numProjectSurveyComments = project.project_surveys
    .map(projectSurvey => projectSurvey.project_survey_comments.length)
    .reduce((a, b) => a + b, 0);
  const numAnnotationIssues = project.project_surveys
    .map(projectSurvey =>
      projectSurvey.survey.survey_questions.reduce(
        (count, surveyQuestion) =>
          surveyQuestion.annotations.filter(a => a.issue && a.issue.open)
            .length + count,
        0
      )
    )
    .reduce((a, b) => a + b, 0);
  const numProjectSurveyCommentIssues = project.project_surveys
    .map(projectSurvey =>
      projectSurvey.project_survey_comments.reduce(
        (count, projectSurveyComment) =>
          projectSurveyComment.issue && projectSurveyComment.issue.open
            ? count + 1
            : count,
        0
      )
    )
    .reduce((a, b) => a + b, 0);
  const projectSurveys =
    project.project_surveys && project.project_surveys.length
      ? project.project_surveys.map(s => {
          const numAnnotation = s.survey.survey_questions.reduce(
            (count, surveyQuestion) =>
              surveyQuestion.annotations.filter(a => a.reviewed !== "spam")
                .length + count,
            0
          );
          const numProjectSurveyComments = s.project_survey_comments.length;
          const numAnnotationIssues = s.survey.survey_questions.reduce(
            (count, surveyQuestion) =>
              surveyQuestion.annotations.filter(a => a.issue).length + count,
            0
          );
          const numProjectSurveyCommentIssues = s.project_survey_comments.reduce(
            (count, projectSurveyComment) =>
              projectSurveyComment.issue && projectSurveyComment.issue.open
                ? count + 1
                : count,
            0
          );
          return _.assignIn(
            _.pick(s.survey, ["creator", "title", "description"]),
            _.omit(
              _.assignIn(s, {
                num_total_annotations: numAnnotation,
                num_total_page_comments: numProjectSurveyComments,
                num_issues: numAnnotationIssues + numProjectSurveyCommentIssues,
                project_symbol: project.symbol
              }),
              ["survey"]
            )
          );
        })
      : [];
  return _.assignIn(project, {
    num_surveys: numSurveys,
    num_total_annotations: numAnnotation,
    num_total_page_comments: numProjectSurveyComments,
    num_issues: numProjectSurveyCommentIssues + numAnnotationIssues,
    project_surveys: projectSurveys
  });
}
