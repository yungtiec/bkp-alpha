"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("documents", "original_document_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "documents",
          key: "id"
        }
      }),
      queryInterface.addColumn("documents", "project_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "projects",
          key: "id"
        }
      }),
      queryInterface.addColumn("documents", "creator_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
        }
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn("documents", "original_document_id"),
      queryInterface.removeColumn("documents", "project_id"),
      queryInterface.removeColumn("documents", "creator_id")
    ];
  }
};
