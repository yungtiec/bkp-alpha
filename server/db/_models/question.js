const Sequelize = require("sequelize");
const db = require("../db");

const Question = db.define("question", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  markdown: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  category_id: {
    type: Sequelize.INTEGER
  }
});

module.exports = Question;
