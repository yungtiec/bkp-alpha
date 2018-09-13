"use strict";
module.exports = (sequelize, DataTypes) => {
  const Issue = sequelize.define("issue", {
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
      type: Sequelize.INTEGER,
      references: {
        model: "version",
        key: "id"
      }
    }
  });
  Issue.associate = function(models) {
    // associations can be defined here
  };
  return Issue;
};
