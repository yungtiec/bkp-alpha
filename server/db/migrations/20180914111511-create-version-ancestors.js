"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("versionsancestors", {
      versionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "versions",
          key: "id"
        }
      },
      ancestorId: {
        type: Sequelize.INTEGER,
        references: {
          model: "versions",
          key: "id"
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("versionsancestors");
  }
};
