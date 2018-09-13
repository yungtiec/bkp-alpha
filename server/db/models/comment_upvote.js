"use strict";
module.exports = (sequelize, DataTypes) => {
  const CommentUpvote = sequelize.define(
    "comment_upvote",
    {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id"
        }
      },
      comment_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "comment",
          key: "id"
        }
      }
    },
    {}
  );
  CommentUpvote.associate = function(models) {
    // associations can be defined here
  };
  return CommentUpvote;
};
