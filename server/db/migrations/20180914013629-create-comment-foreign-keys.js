"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("comments", "owner_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
        }
      }),
      queryInterface.addColumn("comments", "version_question_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "version_questions",
          key: "id"
        }
      }),
      queryInterface.addColumn("comments", "version_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "versions",
          key: "id"
        }
      }),
      queryInterface.addColumn("comments", "parentId", {
        type: Sequelize.INTEGER,
        references: {
          model: "comments",
          key: "id"
        }
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn("comments", "owner_id"),
      queryInterface.removeColumn("comments", "version_question_id"),
      queryInterface.removeColumn("comments", "version_id"),
      queryInterface.removeColumn("comments", "parentId")
    ];
  }
};
