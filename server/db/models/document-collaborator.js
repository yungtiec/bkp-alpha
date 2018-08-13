const Sequelize = require("sequelize");
const db = require("../db");

const DocumentCollaborator = db.define("document_collaborator", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING
  },
  user_id: {
    type: Sequelize.INTEGER
  },
  document_id: {
    type: Sequelize.INTEGER
  },
  document_version_number: {
    type: Sequelize.INTEGER
  },
  revoked_access: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = DocumentCollaborator;
