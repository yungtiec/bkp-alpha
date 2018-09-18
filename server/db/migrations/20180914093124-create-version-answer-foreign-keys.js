"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("version_answers", "version_question_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "version_questions",
          key: "id"
        }
      }),
      queryInterface.addColumn("version_answers", "parentId", {
        type: Sequelize.INTEGER,
        references: {
          model: "version_answers",
          key: "id"
        }
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn("version_answers", "version_question_id"),
      queryInterface.removeColumn("version_answers", "parentId")
    ];
  }
};
