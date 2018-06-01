const Sequelize = require("sequelize");
const db = require("../db");

const Collaborator = db.define("collaborator", {
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
  project_survey_id: {
    type: Sequelize.INTEGER
  }
});

module.exports = Collaborator;
