const Sequelize = require("sequelize");
const db = require("../db");

const Survey = db.define("survey", {
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
}, {
  scopes: {

  }
});

module.exports = Survey;
