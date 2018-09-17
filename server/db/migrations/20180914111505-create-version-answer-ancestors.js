"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("version_answersancestors", {
      commentId: {
        type: Sequelize.INTEGER,
        references: {
          model: "version_answers",
          key: "id"
        }
      },
      ancestorId: {
        type: Sequelize.INTEGER,
        references: {
          model: "version_answers",
          key: "id"
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("version_answersancestors");
  }
};
