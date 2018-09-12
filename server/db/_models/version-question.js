const Sequelize = require("sequelize");
const db = require("../db");

const VersionQuestion = db.define(
  "version_question",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    version_id: {
      type: Sequelize.INTEGER
    },
    order_in_version: {
      type: Sequelize.INTEGER
    },
    markdown: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    category_id: {
      type: Sequelize.INTEGER
    },
    latest: {
      type: Sequelize.BOOLEAN
    }
  },
  {
    scopes: {
      withVersionAnswers: function(id) {
        return {
          where: { id },
          include: [
            {
              model: db.model("version_answer"),
              where: { latest: true },
              include: [
                {
                  model: db.model("version_answer"),
                  as: "ancestors",
                  attributes: ["id", "createdAt"],
                  required: false
                },
                {
                  model: db.model("version_answer"),
                  as: "descendents",
                  attributes: ["id", "createdAt"],
                  required: false
                }
              ],
              order: [
                [
                  {
                    model: db.model("version_answer"),
                    as: "descendents"
                  },
                  "hierarchyLevel",
                  "DESC"
                ],
                [
                  {
                    model: db.model("version_answer"),
                    as: "ancestors"
                  },
                  "hierarchyLevel",
                  "DESC"
                ]
              ]
            }
          ]
        };
      },
      withAncestorsAndVersionAnswers: function(id) {
        return {
          where: { id },
          include: [
            {
              model: db.model("version_answer"),
              where: { latest: true },
              include: [
                {
                  model: db.model("version_answer"),
                  as: "ancestors",
                  attributes: ["id", "createdAt"],
                  required: false
                },
                {
                  model: db.model("version_answer"),
                  as: "descendents",
                  attributes: ["id", "createdAt"],
                  required: false
                }
              ],
              order: [
                [
                  {
                    model: db.model("version_answer"),
                    as: "descendents"
                  },
                  "hierarchyLevel",
                  "DESC"
                ],
                [
                  {
                    model: db.model("version_answer"),
                    as: "ancestors"
                  },
                  "hierarchyLevel",
                  "DESC"
                ]
              ]
            },
            {
              model: db.model("version_question"),
              as: "ancestors",
              attributes: ["id", "createdAt"]
            }
          ],
          order: [
            [
              { model: db.model("version_question"), as: "ancestors" },
              "hierarchyLevel",
              "DESC"
            ]
          ]
        };
      }
    }
  }
);

module.exports = VersionQuestion;
