"use strict";
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "tag",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {}
  );
  Tag.associate = function(models) {
    // associations can be defined here
  };
  return Tag;
};
