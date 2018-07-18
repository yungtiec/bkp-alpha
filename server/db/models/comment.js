const Sequelize = require("sequelize");
const db = require("../db");
const { assignIn } = require("lodash");

const Comment = db.define(
  "comment",
  {
    uri: {
      type: Sequelize.STRING
    },
    survey_question_id: {
      type: Sequelize.INTEGER
    },
    survey_answer_id: {
      type: Sequelize.INTEGER
    },
    quote: {
      type: Sequelize.TEXT
    },
    comment: {
      type: Sequelize.TEXT
    },
    annotator_schema_version: {
      type: Sequelize.STRING
    },
    ranges: {
      type: Sequelize.ARRAY(Sequelize.JSON)
    },
    upvotes: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    reviewed: {
      type: Sequelize.ENUM("pending", "spam", "verified"),
      defaultValue: "pending"
    }
  },
  {
    hierarchy: true,
    scopes: {
      withProjectSurveys: function(moreIncludeOptions) {
        var options = {
          include: [
            {
              model: db.model("project_survey"),
              include: [
                {
                  model: db.model("survey"),
                  attributes: ["title"],
                  include: [
                    {
                      model: db.model("user"),
                      as: "collaborators",
                      required: false
                    },
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
                    }
                  ]
                }
              ]
            }
          ]
        };
        if (moreIncludeOptions)
          options.include = options.include.concat(moreIncludeOptions);
        return options;
      },
      upvotes: function(commentId) {
        return {
          where: { id: commentId },
          include: [
            {
              model: db.model("user"),
              as: "upvotesFrom",
              attributes: ["first_name", "last_name", "name", "email"]
            },
            {
              model: db.model("user"),
              as: "owner",
              attributes: ["first_name", "last_name", "name", "email", "id"]
            },
            {
              model: db.model("project_survey"),
              include: [
                {
                  model: db.model("survey"),
                  include: [
                    {
                      model: db.model("project"),
                      attributes: ["symbol"]
                    }
                  ]
                }
              ]
            },
            {
              model: db.model("comment"),
              as: "ancestors",
              required: false,
              attributes: ["id", "owner_id"],
              include: [
                {
                  model: db.model("user"),
                  as: "owner",
                  required: false
                }
              ],
              order: [
                [
                  {
                    model: Comment,
                    as: "ancestors"
                  },
                  "hierarchyLevel"
                ]
              ]
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
              attributes: ["first_name", "last_name", "name", "email"]
            },
            {
              model: db.model("user"),
              as: "owner",
              attributes: ["first_name", "last_name", "name", "email"]
            },
            {
              model: db.model("tag"),
              attributes: ["name", "id"]
            },
            {
              model: db.model("project_survey"),
              include: [
                {
                  model: db.model("survey"),
                  include: [
                    {
                      model: db.model("project"),
                      attributes: ["symbol"]
                    }
                  ]
                }
              ]
            },
            {
              model: db.model("issue"),
              attributes: ["open", "id"],
              include: [
                {
                  model: db.model("project_survey"),
                  as: "resolvingProjectSurvey",
                  include: [
                    {
                      model: db.model("survey"),
                      include: [
                        {
                          model: db.model("project"),
                          attributes: ["symbol"]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              model: Comment,
              required: false,
              include: [
                {
                  model: db.model("user"),
                  as: "upvotesFrom",
                  attributes: ["first_name", "last_name", "name", "email"]
                },
                {
                  model: db.model("user"),
                  as: "owner",
                  attributes: ["first_name", "last_name", "name", "email"]
                },
                {
                  model: Comment,
                  as: "parent",
                  required: false,
                  include: [
                    {
                      model: db.model("user"),
                      as: "owner",
                      attributes: ["first_name", "last_name", "name", "email"]
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
                model: Comment,
                as: "descendents"
              },
              "createdAt"
            ]
          ]
        };
        if (options) query = assignIn(options, query);
        return query;
      }
    }
  }
);

module.exports = Comment;
