"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("document_collaborators", "user_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
        }
      }),
      queryInterface.addColumn("document_collaborators", "document_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "documents",
          key: "id"
        }
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn("document_collaborators", "user_id"),
      queryInterface.removeColumn("document_collaborators", "document_id")
    ];
  }
};
