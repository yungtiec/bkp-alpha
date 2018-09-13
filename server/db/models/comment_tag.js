"use strict";
module.exports = (db, DataTypes) => {
  const CommentTag = db.define("comment_tag", {
    comment_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "comment",
        key: "id"
      }
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "tag",
        key: "id"
      }
    }
  });
  CommentTag.associate = function(models) {
    // associations can be defined here
  };
  return CommentTag;
};
