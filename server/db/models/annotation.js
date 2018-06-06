const Sequelize = require("sequelize");
const db = require("../db");
const { assignIn } = require("lodash");

const Annotation = db.define(
  "annotation",
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
    },
    engagementItemType: {
      type: Sequelize.VIRTUAL,
      get() {
        return "annotation";
      }
    },
    engagementItemId: {
      type: Sequelize.VIRTUAL,
      get() {
        return "annotation" + this.getDataValue("id");
      }
    }
  },
  {
    hierarchy: true,
    scopes: {
      upvotes: function(annotationId) {
        return {
          where: { id: annotationId },
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
              model: db.model("annotation"),
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
                    model: Annotation,
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
              model: Annotation,
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
              model: Annotation,
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
                  model: Annotation,
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
                model: Annotation,
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

module.exports = Annotation;
