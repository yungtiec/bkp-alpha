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
    comment_id: {
      type: Sequelize.INTEGER
    },
    resolving_version_id: {
      type: Sequelize.INTEGER
    }
  });
  Issue.associate = function(models) {
    Issue.belongsTo(model.Comment, {
      foreignKey: "comment_id"
    });
    Issue.belongsTo(model.Version, {
      foreignKey: "resolving_version_id",
      as: "resolvingVersion"
    });
  };
  return Issue;
};
