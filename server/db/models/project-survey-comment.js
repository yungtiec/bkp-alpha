const Sequelize = require("sequelize");
const db = require("../db");
const { assignIn } = require("lodash");

// should have 1:n associations with project_survey
// not set up yet cuz we're using client/mock-data
const ProjectSurveyComment = db.define(
  "project_survey_comment",
  {
    comment: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    project_survey_id: {
      type: Sequelize.INTEGER
    },
    reviewed: {
      type: Sequelize.ENUM("pending", "spam", "verified"),
      defaultValue: "pending"
    },
    engagementItemType: {
      type: Sequelize.VIRTUAL,
      get() {
        return "page_comment";
      }
    },
    engagementItemId: {
      type: Sequelize.VIRTUAL,
      get() {
        return "page_comment" + this.getDataValue("id");
      }
    }
  },
  {
    hierarchy: true,
    scopes: {
      allByProjectSurveyId: function(projectSurvetId) {
        return {
          where: {
            project_survey_id: projectSurvetId,
            parentId: null,
            reviewed: { [Sequelize.Op.ne]: "spam" }
          },
          include: [
            {
              model: db.model("user"),
              as: "owner",
              attributes: ["first_name", "last_name", "email"]
            },
            {
              model: db.model("user"),
              as: "upvotesFrom",
              attributes: ["first_name", "last_name", "email"]
            },
            {
              model: db.model("tag"),
              attributes: ["name", "id"]
            },
            {
              model: db.model("issue"),
              attributes: ["open", "id"]
            },
            {
              model: db.model("project_survey_comment"),
              where: {
                reviewed: {
                  [Sequelize.Op.or]: [
                    { [Sequelize.Op.eq]: "pending" },
                    { [Sequelize.Op.eq]: "verified" }
                  ]
                }
              },
              required: false,
              include: [
                {
                  model: db.model("user"),
                  as: "upvotesFrom",
                  attributes: ["first_name", "last_name", "email"]
                },
                {
                  model: db.model("user"),
                  as: "owner",
                  attributes: ["first_name", "last_name", "email"]
                }
              ],
              as: "descendents",
              hierarchy: true
            }
          ]
        };
      },
      oneThreadByRootId: function(rootId) {
        return {
          where: { id: rootId, reviewed: { [Sequelize.Op.ne]: "spam" } },
          include: [
            {
              model: db.model("user"),
              as: "upvotesFrom",
              attributes: ["first_name", "last_name", "email"]
            },
            {
              model: db.model("user"),
              as: "owner",
              attributes: ["first_name", "last_name", "email"]
            },
            {
              model: db.model("tag"),
              attributes: ["name", "id"]
            },
            {
              model: db.model("issue"),
              attributes: ["open", "id"]
            },
            {
              model: db.model("project_survey_comment"),
              where: {
                reviewed: {
                  [Sequelize.Op.or]: [
                    { [Sequelize.Op.eq]: "pending" },
                    { [Sequelize.Op.eq]: "verified" }
                  ]
                }
              },
              required: false,
              include: [
                {
                  model: db.model("user"),
                  as: "upvotesFrom",
                  attributes: ["first_name", "last_name", "email"]
                },
                {
                  model: db.model("user"),
                  as: "owner",
                  attributes: ["first_name", "last_name", "email"]
                }
              ],
              as: "descendents",
              hierarchy: true
            }
          ]
        };
      },
      flatThreadByRootId: function(options) {
        var query = {
          include: [
            {
              model: db.model("user"),
              as: "upvotesFrom",
              attributes: ["first_name", "last_name", "email"]
            },
            {
              model: db.model("user"),
              as: "owner",
              attributes: ["first_name", "last_name", "email"]
            },
            {
              model: db.model("tag"),
              attributes: ["name", "id"]
            },
            {
              model: db.model("issue"),
              attributes: ["open", "id"]
            },
            {
              model: ProjectSurveyComment,
              required: false,
              include: [
                {
                  model: db.model("user"),
                  as: "upvotesFrom",
                  attributes: ["first_name", "last_name", "email"]
                },
                {
                  model: db.model("user"),
                  as: "owner",
                  attributes: ["first_name", "last_name", "email"]
                },
                {
                  model: ProjectSurveyComment,
                  as: "parent",
                  required: false,
                  include: [
                    {
                      model: db.model("user"),
                      as: "owner",
                      attributes: ["first_name", "last_name", "email"]
                    }
                  ]
                }
              ],
              as: "descendents"
            }
          ],
          order: [
            [
              {
                model: ProjectSurveyComment,
                as: "descendents"
              },
              "createdAt"
            ]
          ]
        };
        if (options) query = assignIn(options, query);
        return query;
      },
      upvotes: function(projectSurveyCommentId) {
        return {
          where: { id: projectSurveyCommentId },
          include: [
            {
              model: db.model("user"),
              as: "upvotesFrom",
              attributes: ["first_name", "last_name", "email"]
            },
            {
              model: db.model("user"),
              as: "owner",
              attributes: ["first_name", "last_name", "email", "id"]
            },
            {
              model: db.model("project_survey"),
              include: [
                {
                  model: db.model("project")
                },
                {
                  model: db.model("survey")
                }
              ]
            },
            {
              model: db.model("project_survey_comment"),
              as: "ancestors",
              required: false,
              attributes: ["id", "owner_id"],
              include: [
                {
                  model: db.model("user"),
                  as: "owner",
                  required: false
                },
                {
                  model: db.model("project_survey"),
                  include: [
                    {
                      model: db.model("project")
                    },
                    {
                      model: db.model("survey")
                    }
                  ]
                }
              ],
              order: [
                [
                  {
                    model: db.model("project_survey_comment"),
                    as: "ancestors"
                  },
                  "hierarchyLevel"
                ]
              ]
            }
          ]
        };
      },
      withProjectSurveyInfo: function(id) {
        return {
          where: { id },
          include: [
            {
              model: db.model("user"),
              as: "owner",
              attributes: ["first_name", "last_name", "email", "id"]
            },
            {
              model: db.model("project_survey"),
              include: [
                {
                  model: db.model("project")
                },
                {
                  model: db.model("survey")
                }
              ]
            }
          ]
        };
      }
    }
  }
);

module.exports = ProjectSurveyComment;
