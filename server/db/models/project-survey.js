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
    submitted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    reviewed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    comment_until_unix: {
      type: Sequelize.BIGINT
    },
    scorecard: {
      type: Sequelize.JSONB
    }
  },
  {
    hierarchy: true,
    scopes: {
      byIdWithMetadata: function(projectSurveyId) {
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
                  model: db.model("project"),
                  include: [
                    {
                      model: db.model("user"),
                      through: db.model("project_admin"),
                      as: "admins"
                    },
                    {
                      model: db.model("user"),
                      through: db.model("project_editor"),
                      as: "editors"
                    }
                  ]
                },
                {
                  model: db.model("project_survey"),
                  attributes: [
                    "id",
                    "hierarchyLevel",
                    "creator_id",
                    "createdAt"
                  ],
                  include: [
                    { model: db.model("survey") },
                    {
                      model: db.model("user"),
                      as: "creator"
                    },
                    {
                      model: db.model("issue"),
                      as: "resolvedIssues", // use in SurveyProgress
                      required: false,
                      include: [
                        {
                          model: db.model("comment"),
                          required: false
                        }
                      ]
                    },
                    {
                      model: db.model("comment"), // use in SurveyIssues
                      required: false,
                      include: [
                        {
                          model: db.model("issue"),
                          required: false,
                          where: { open: true }
                        }
                      ]
                    }
                  ],
                  order: [
                    [{ model: db.model("project_survey") }, "hierarchyLevel"]
                  ]
                },
                {
                  model: db.model("user"),
                  as: "collaborators",
                  through: {
                    model: db.model("survey_collaborator"),
                    where: { revoked_access: { [Sequelize.Op.not]: true } }
                  },
                  required: false
                },
                {
                  model: db.model("user"),
                  as: "creator"
                },
                {
                  model: db.model("user"),
                  as: "upvotesFrom",
                  attributes: ["name", "first_name", "last_name", "email", "id"]
                },
                {
                  model: db.model("user"),
                  as: "downvotesFrom",
                  attributes: ["name", "first_name", "last_name", "email", "id"]
                }
              ]
            }
          ]
        };
      },
      byIdWithSurveyQuestions: function(projectSurveyId) {
        return {
          where: { id: projectSurveyId },
          include: [
            {
              model: db.model("survey_question"),
              include: [
                {
                  model: db.model("question")
                },
                {
                  model: db.model("project_survey_answer"),
                  include: [
                    {
                      model: db.model("project_survey_answer"),
                      as: "descendents",
                      hierarchy: true,
                      required: false
                    }
                  ]
                }
              ]
            }
          ]
        };
      }
    }
  }
);

module.exports = ProjectSurvey;
