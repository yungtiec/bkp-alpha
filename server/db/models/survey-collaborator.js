const Sequelize = require("sequelize");
const db = require("../db");

const SurveyCollaborator = db.define("survey_collaborator", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING
  },
  user_id: {
    type: Sequelize.INTEGER
  },
  survey_id: {
    type: Sequelize.INTEGER
  },
  project_survey_version: {
    type: Sequelize.INTEGER
  },
  revoked_access: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = SurveyCollaborator;
