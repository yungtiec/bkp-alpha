"use strict";
module.exports = (db, DataTypes) => {
  const DocumentCollaborator = db.define("document_collaborator", {
    email: DataTypes.STRING,
    document_version_number: DataTypes.INTEGER,
    revoked_access: DataTypes.BOOLEAN
  });
  return DocumentCollaborator;
};
