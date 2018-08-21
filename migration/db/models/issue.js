const Sequelize = require("sequelize");
const db = require("../db");

const Issue = db.define("issue", {
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.TEXT,
  },
  open: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
  },
  resolving_project_survey_id: {
    type: Sequelize.INTEGER
  }
});

module.exports = Issue;
