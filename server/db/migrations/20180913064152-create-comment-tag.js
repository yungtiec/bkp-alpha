"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("comment_tags", {
      comment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "comment",
          key: "id"
        }
      },
      tag_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "tag",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("comment_tags");
  }
};
