const Sequelize = require("sequelize");
const db = require("../db");

const Role = db.define("role", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  }
});

module.exports = Role;
