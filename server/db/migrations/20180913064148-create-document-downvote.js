"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("document_downvotes", {
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id"
        }
      },
      document_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "document",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("document_downvotes");
  }
};
