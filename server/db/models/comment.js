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
              attributes: [
                "first_name",
                "last_name",
                "name",
                "email",
                "id",
                "anonymity"
              ]
            },
            {
              model: db.model("project_survey"),
              include: [
                {
                  model: db.model("project"),
                  attributes: ["symbol"]
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
      oneThreadByRootId: function(id) {
        return {
          where: { id },
          include: [
            {
              model: db.model("user"),
              as: "upvotesFrom",
              attributes: ["first_name", "last_name", "name", "email"]
            },
            {
              model: db.model("user"),
              as: "owner",
              attributes: [
                "first_name",
                "last_name",
                "name",
                "email",
                "anonymity"
              ]
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
                  attributes: [
                    "first_name",
                    "last_name",
                    "name",
                    "email",
                    "anonymity"
                  ]
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
              attributes: ["first_name", "last_name", "name", "email"]
            },
            {
              model: db.model("user"),
              as: "owner",
              attributes: [
                "first_name",
                "last_name",
                "name",
                "email",
                "anonymity"
              ]
            },
            {
              model: db.model("tag"),
              attributes: ["name", "id"]
            },
            {
              model: db.model("project_survey"),
              include: [
                {
                  model: db.model("project"),
                  attributes: ["symbol"]
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
                      model: db.model("project"),
                      attributes: ["symbol"]
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
                  attributes: [
                    "first_name",
                    "last_name",
                    "name",
                    "email",
                    "anonymity"
                  ]
                },
                {
                  model: Comment,
                  as: "parent",
                  required: false,
                  include: [
                    {
                      model: db.model("user"),
                      as: "owner",
                      attributes: [
                        "first_name",
                        "last_name",
                        "name",
                        "email",
                        "anonymity"
                      ]
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
