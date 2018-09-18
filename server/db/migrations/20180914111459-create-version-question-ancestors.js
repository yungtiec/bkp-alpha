"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("version_questionsancestors", {
      commentId: {
        type: Sequelize.INTEGER,
        references: {
          model: "version_questions",
          key: "id"
        }
      },
      ancestorId: {
        type: Sequelize.INTEGER,
        references: {
          model: "version_questions",
          key: "id"
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("version_questionsancestors");
  }
};
