"use strict";
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define("tag", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  Tag.associate = function(models) {
    Tag.belongsToMany(models.Comment, {
      through: "comment_tag",
      foreignKey: "tag_id"
    });
  };
  return Tag;
};
