"use strict";
module.exports = (db, DataTypes) => {
  const DocumentCollaborator = db.define("document_collaborator", {
    email: DataTypes.STRING,
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
    },
    document_version_number: DataTypes.INTEGER,
    revoked_access: DataTypes.BOOLEAN
  });
  DocumentCollaborator.associate = function(models) {
    // associations can be defined here
  };
  return DocumentCollaborator;
};
