"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("notifications", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uri: {
        type: Sequelize.TEXT
      },
      message: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM,
        values: ["seen", "read", "unread"]
      },
      read_date: {
        type: Sequelize.DATE
      },
      disclosure_updated: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable("notifications");
  }
};
