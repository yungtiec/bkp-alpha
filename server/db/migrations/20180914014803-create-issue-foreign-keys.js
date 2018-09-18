"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("issues", "comment_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "comments",
          key: "id"
        }
      }),
      queryInterface.addColumn("issues", "resolving_version_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "versions",
          key: "id"
        }
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn("issues", "comment_id"),
      queryInterface.removeColumn("issues", "resolving_version_id")
    ];
  }
};
