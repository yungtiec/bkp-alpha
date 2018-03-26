const Sequelize = require("sequelize");
const db = require("../db");

const Permission = db.define("permission", {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
});

module.exports = Permission;
