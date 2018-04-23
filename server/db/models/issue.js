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
  }
});

module.exports = Issue;
