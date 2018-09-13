"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("issues", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      open: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING
      },
      comment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "comment",
          key: "id"
        }
      },
      resolving_version_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "version",
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
    return queryInterface.dropTable("issues");
  }
};
