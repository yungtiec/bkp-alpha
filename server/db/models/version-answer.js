const Sequelize = require("sequelize");
const db = require("../db");

const VersionAnswer = db.define(
  "version_answer",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    version_id: {
      type: Sequelize.INTEGER
    },
    version_question_id: {
      type: Sequelize.INTEGER
    },
    json: {
      type: Sequelize.JSON
    },
    markdown: {
      type: Sequelize.TEXT
    },
    latest: {
      type: Sequelize.BOOLEAN
    }
  }
);

module.exports = VersionAnswer;
