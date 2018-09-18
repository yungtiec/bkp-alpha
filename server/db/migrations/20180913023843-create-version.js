"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("versions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      submitted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      reviewed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      comment_until_unix: {
        type: Sequelize.BIGINT
      },
      scorecard: {
        type: Sequelize.JSONB
      },
      version_number: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }, // sequelize hierarchy
      hierarchyLevel: {
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("versions");
  }
};
