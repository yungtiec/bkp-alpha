"use strict";
module.exports = (db, DataTypes) => {
  const DocumentDownvote = db.define("document_downvote", {
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
  DocumentDownvote.associate = function(models) {
    // associations can be defined here
  };
  return DocumentDownvote;
};
