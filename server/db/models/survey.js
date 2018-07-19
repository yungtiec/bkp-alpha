const Sequelize = require("sequelize");
const db = require("../db");

const Survey = db.define(
  "survey",
  {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING
    },
    forked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    original_survey_id: {
      type: Sequelize.INTEGER
    },
    original_project_survey_version: {
      type: Sequelize.INTEGER
    },
    project_id: {
      type: Sequelize.INTEGER
    },
    latest_version: {
      type: Sequelize.INTEGER
    }
  },
  {
    scopes: {
      allRootsWithDescendants: function() {
        return {
          include: [
            { model: db.model("project_survey") },
            {
              model: db.model("project")
            }
          ],
          order: [
            ["createdAt", "DESC"],
            [
              { model: db.model("project_survey") },
              "hierarchyLevel",
              "DESC"
            ]
          ]
        };
      }
    }
  }
);

module.exports = Survey;
