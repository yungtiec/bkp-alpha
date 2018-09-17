"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("versions", "document_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "documents",
          key: "id"
        }
      }),
      queryInterface.addColumn("versions", "creator_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
        }
      }),
      queryInterface.addColumn("versions", "parentId", {
        type: Sequelize.INTEGER,
        references: {
          model: "versions",
          key: "id"
        }
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn("versions", "document_id"),
      queryInterface.removeColumn("versions", "creator_id"),
      queryInterface.removeColumn("versions", "parentId")
    ];
  }
};
