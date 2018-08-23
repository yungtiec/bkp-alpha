const Sequelize = require("sequelize");
const db = require("../db");

const QuestionCategory = db.define(
  "question_category",
  {
    name: {
      type: Sequelize.INTEGER
    }
  }
);

module.exports = QuestionCategory;
