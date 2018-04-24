const Sequelize = require("sequelize");
const db = require("../db");

const ProjectSurveyAnswer = db.define(
  "project_survey_answer",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    project_survey_id: {
      type: Sequelize.INTEGER
    },
    survey_question_id: {
      type: Sequelize.INTEGER
    },
    answer_json: {
      type: Sequelize.JSON
    },
    answer: {
      type: Sequelize.TEXT
    }
  },
  {
    hierarchy: true
  }
);

module.exports = ProjectSurveyAnswer;
