"use strict";
module.exports = (db, DataTypes) => {
  const DocumentUpvote = db.define("document_upvote", {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id"
      }
    },
    document_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "document",
        key: "id"
      }
    }
  });
  DocumentUpvote.associate = function(models) {
    // associations can be defined here
  };
  return DocumentUpvote;
};
