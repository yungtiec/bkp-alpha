"use strict";
module.exports = (sequelize, DataTypes) => {
  const Issue = sequelize.define("issue", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    open: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING
    }
  });
  Issue.associate = function(models) {
    Issue.belongsTo(models.comment, {
      foreignKey: "comment_id"
    });
    Issue.belongsTo(models.version, {
      foreignKey: "resolving_version_id",
      as: "resolvingVersion"
    });
  };
  return Issue;
};
