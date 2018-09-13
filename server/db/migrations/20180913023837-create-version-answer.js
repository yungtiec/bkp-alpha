"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("version_answers", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      version_question_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "version_question",
          key: "id"
        }
      },
      markdown: {
        type: Sequelize.TEXT
      },
      latest: {
        type: Sequelize.BOOLEAN
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
          model: "version_answer",
          key: "id"
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("version_answers");
  }
};
