"use strict";
module.exports = (db, DataTypes) => {
  const DocumentCollaborator = db.define("document_collaborator", {
    email: DataTypes.STRING,
    user_id: {
      type: DataTypes.INTEGER
    },
    document_id: {
      type: DataTypes.INTEGER
    },
    document_version_number: DataTypes.INTEGER,
    revoked_access: DataTypes.BOOLEAN
  });
  DocumentCollaborator.associate = function(models) {
    // associations can be defined here
  };
  return DocumentCollaborator;
};
