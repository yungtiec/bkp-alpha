const Sequelize = require("sequelize");
const db = require("../db");

const Collaborator = db.define("project_admin", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: Sequelize.INTEGER
  },
  project_id: {
    type: Sequelize.INTEGER
  }
});

module.exports = Collaborator;
