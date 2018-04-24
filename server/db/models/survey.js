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
  creator_id: {
    type: Sequelize.INTEGER
  }
});

module.exports = Survey;
