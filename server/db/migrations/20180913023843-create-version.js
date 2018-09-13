"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("versions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      document_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "document",
          key: "id"
        }
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
      },
      parentId: {
        type: Sequelize.INTEGER,
        references: {
          model: "version",
          key: "id"
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("versions");
  }
};
