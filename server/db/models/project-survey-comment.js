const Sequelize = require("sequelize");
const db = require("../db");

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
    }
  },
  {
    hierarchy: true
  }
);

module.exports = ProjectSurveyComment;
