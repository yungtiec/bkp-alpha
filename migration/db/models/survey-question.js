const Sequelize = require("sequelize");
const db = require("../db");

const SurveyQuestion = db.define("survey_question", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  survey_id: {
    type: Sequelize.INTEGER,
  },
  question_id: {
    type: Sequelize.INTEGER,
  },
  order_in_survey: {
    type: Sequelize.INTEGER,
  }
});

module.exports = SurveyQuestion;
