const Sequelize = require("sequelize");
const db = require("../db");
const _ = require("lodash");

const ProjectSurvey = db.define(
  "project_survey",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    survey_id: {
      type: Sequelize.INTEGER
    },
    project_id: {
      type: Sequelize.INTEGER
    },
    submitted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    reviewed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  },
  {
    scopes: {
      byProjectSurveyId: function(projectSurveyId) {
        return {
          where: { id: projectSurveyId },
          include: [
            {
              model: db.model("user"),
              as: "creator"
            },
            {
              model: db.model("survey"),
              include: [
                {
                  model: db.model("survey_question"),
                  include: [
                    {
                      model: db.model("question")
                    },
                    {
                      model: db.model("project_survey_answer"),
                      where: {
                        project_survey_id: projectSurveyId
                      },
                      include: [
                        {
                          model: db.model("project_survey_answer"),
                          where: {
                            project_survey_id: projectSurveyId
                          },
                          as: "descendents",
                          hierarchy: true,
                          required: false
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        };
      },
      allPublishedSurveys: function() {
        return {
          where: { submitted: true, reviewed: true },
          include: [
            {
              model: db.model("user"),
              as: "creator"
            },
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
                        },
                        {
                          model: db.model("user"),
                          as: "upvotesFrom",
                          attributes: ["id"],
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
                },
                {
                  model: db.model("user"),
                  as: "upvotesFrom",
                  attributes: ["id"],
                  required: false
                }
              ]
            },
            {
              model: db.model("project")
            }
          ],
          order: [["createdAt", "DESC"]]
        };
      }
    }
  }
);

ProjectSurvey.getAllPublishedSurveysWithStats = async function() {
  const projectSurveys = await ProjectSurvey.scope(
    "allPublishedSurveys"
  ).findAll();
  return getPublishedSurveysStats(projectSurveys);
};

ProjectSurvey.getLatestPublishedSurveysWithStats = async function() {
  return await ProjectSurvey.scope("allPublishedSurveys").find({ limit: 10 });
};

module.exports = ProjectSurvey;

/**
 *
 * helpers
 *
 */

function getPublishedSurveysStats(projectSurveys) {
  return Promise.map(projectSurveys, projectSurveyInstance => {
    const rawProjectSurvey = projectSurveyInstance.toJSON();
    const annotations = rawProjectSurvey.survey.survey_questions.reduce(
      (aggregatedAnnotation, surveyQuestion) => {
        return aggregatedAnnotation.concat(surveyQuestion.annotations);
      },
      []
    );
    const numPendingAnnotations = annotations.filter(
      a => a.reviewed === "pending"
    ).length;
    const numTotalAnnotations = annotations.filter(a => a.reviewed !== "spam")
      .length;
    const numAnnotationUpvotes = annotations.reduce(
      (upvotes, ann) => upvotes.concat(ann.upvotesFrom),
      []
    );
    const numAnnotationIssues = annotations.filter(a => !!a.issue).length;
    const numPendingPageComments = rawProjectSurvey.project_survey_comments.filter(
      a => a.reviewed === "pending"
    ).length;
    const numTotalPageComments = rawProjectSurvey.project_survey_comments.filter(
      a => a.reviewed !== "spam"
    ).length;
    const numPageCommentUpvotes = rawProjectSurvey.project_survey_comments.reduce(
      (upvotes, comment) => upvotes.concat(comment.upvotesFrom),
      []
    );
    const numPageCommentIssues = rawProjectSurvey.project_survey_comments.filter(
      a => !!a.issue
    ).length;
    const numReactions =
      numAnnotationUpvotes.length + numPageCommentUpvotes.length;
    const numIssues = numAnnotationIssues + numPageCommentIssues;
    const projectSurvey = _.assignIn(
      {
        title: rawProjectSurvey.survey.title,
        description: rawProjectSurvey.survey.description,
        creator: rawProjectSurvey.creator,
        num_pending_annotations: numPendingAnnotations,
        num_total_annotations: numTotalAnnotations,
        num_pending_page_comments: numPendingPageComments,
        num_total_page_comments: numTotalPageComments,
        num_reaction: numReactions,
        num_issues: numIssues
      },
      _.omit(rawProjectSurvey, ["survey", "project_survey_comments"])
    );
    return projectSurvey;
  });
}
