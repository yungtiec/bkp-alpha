"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("version_questions", "version_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "versions",
          key: "id"
        }
      }),
      queryInterface.addColumn("version_questions", "parentId", {
        type: Sequelize.INTEGER,
        references: {
          model: "version_questions",
          key: "id"
        }
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn("version_questions", "version_id"),
      queryInterface.removeColumn("version_questions", "parentId")
    ];
  }
};
