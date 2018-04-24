const Sequelize = require("sequelize");
const db = require("../db");

const ProjectSurvey = db.define("project_survey", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  survey_id: {
    type: Sequelize.INTEGER,
  },
  project_id: {
    type: Sequelize.INTEGER,
  },
  submitted: {
    type: Sequelize.BOOLEAN,
  },
  reviewed: {
    type: Sequelize.BOOLEAN,
  }
});

module.exports = ProjectSurvey;
