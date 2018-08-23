const Sequelize = require("sequelize");
const db = require("../db");

const VersionQuestion = db.define("version_question", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  version_id: {
    type: Sequelize.INTEGER
  },
  order_in_version: {
    type: Sequelize.INTEGER
  },
  markdown: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  category_id: {
    type: Sequelize.INTEGER
  },
  latest: {
    type: Sequelize.BOOLEAN
  }
});

module.exports = VersionQuestion;
