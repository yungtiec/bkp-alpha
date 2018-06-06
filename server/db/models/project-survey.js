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
    },
    forked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    original_id: {
      type: Sequelize.INTEGER
    }
  },
  {
    hierarchy: true,
    scopes: {
      byProjectSurveyId: function(projectSurveyId) {
        return {
          where: { id: projectSurveyId },
          include: [
            {
              model: db.model("issue"),
              as: "resolvedIssues",
              required: false,
              include: [
                {
                  model: db.model("annotation"),
                  required: false
                }
              ]
            },
            {
              model: db.model("project_survey"),
              as: "ancestors",
              attributes: ["id", "hierarchyLevel", "creator_id", "createdAt"],
              include: [
                { model: db.model("survey") },
                {
                  model: db.model("user"),
                  as: "creator"
                },
                {
                  model: db.model("user"),
                  as: "collaborators",
                  required: false
                },
                {
                  model: db.model("issue"),
                  as: "resolvedIssues",
                  required: false,
                  include: [
                    {
                      model: db.model("annotation"),
                      required: false
                    }
                  ]
                }
              ]
            },
            {
              model: db.model("project_survey"),
              as: "descendents",
              attributes: ["id", "hierarchyLevel", "creator_id", "createdAt"],
              include: [
                { model: db.model("survey") },
                {
                  model: db.model("user"),
                  as: "creator"
                },
                {
                  model: db.model("user"),
                  as: "collaborators",
                  required: false
                },
                {
                  model: db.model("issue"),
                  as: "resolvedIssues",
                  required: false,
                  include: [
                    {
                      model: db.model("annotation"),
                      required: false
                    }
                  ]
                }
              ]
            },
            {
              model: db.model("user"),
              as: "creator"
            },
            {
              model: db.model("user"),
              as: "collaborators",
              required: false
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
            },
            {
              model: db.model("project")
            }
          ],
          order: [
            [
              { model: db.model("project_survey"), as: "ancestors" },
              "hierarchyLevel"
            ],
            [
              { model: db.model("project_survey"), as: "descendents" },
              "hierarchyLevel"
            ]
          ]
        };
      },
      allPublishedSurveys: function() {
        return {
          where: { hierarchyLevel: 1 },
          include: [
            { model: db.model("project_survey"), as: "descendents" },
            {
              model: db.model("user"),
              as: "creator"
            },
            {
              model: db.model("user"),
              as: "collaborators",
              required: false
            },
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
            },
            {
              model: db.model("survey")
            },
            {
              model: db.model("project")
            }
          ],
          order: [
            ["createdAt", "DESC"],
            [
              { model: db.model("project_survey"), as: "descendents" },
              "hierarchyLevel"
            ]
          ]
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
  return Promise.map(projectSurveys, async projectSurveyInstance => {
    var rawProjectSurvey = projectSurveyInstance.toJSON();
    if (rawProjectSurvey.descendents.length) {
      projectSurveyInstance = await ProjectSurvey.findOne({
        where: { id: rawProjectSurvey.descendents.slice(-1)[0].id },
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
          },
          {
            model: db.model("survey")
          }
        ]
      });
      rawProjectSurvey = _.assignIn(
        _.pick(rawProjectSurvey, ["creator", "project"]),
        projectSurveyInstance.toJSON()
      );
    }
    const annotations = rawProjectSurvey.annotations;
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
    const projectSurvey = _.assignIn(
      {
        title: rawProjectSurvey.survey.title,
        description: rawProjectSurvey.survey.description,
        creator: rawProjectSurvey.creator,
        num_pending_annotations: numPendingAnnotations,
        num_total_annotations: numTotalAnnotations,
        num_reaction: numAnnotationUpvotes.length,
        num_issues: numAnnotationIssues
      },
      _.omit(rawProjectSurvey, ["survey"])
    );
    return projectSurvey;
  });
}
