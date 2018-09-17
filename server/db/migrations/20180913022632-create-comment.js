"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("comments", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uri: {
        type: Sequelize.STRING
      },
      version_answer_id: {
        type: Sequelize.INTEGER
      },
      quote: {
        type: Sequelize.TEXT
      },
      comment: {
        type: Sequelize.TEXT
      },
      annotator_schema_version: {
        type: Sequelize.STRING
      },
      ranges: {
        type: Sequelize.ARRAY(Sequelize.JSON)
      },
      upvotes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      reviewed: {
        type: Sequelize.ENUM("pending", "spam", "verified"),
        defaultValue: "pending"
      },
      // sequelize hierarchy
      hierarchyLevel: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable("comments");
  }
};
