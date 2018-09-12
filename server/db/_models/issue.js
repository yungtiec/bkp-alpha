const Sequelize = require("sequelize");
const db = require("../db");

const Issue = db.define("issue", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  open: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING
  },
  resolving_version_id: {
    type: Sequelize.INTEGER
  }
});

module.exports = Issue;
