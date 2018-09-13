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
      version_question_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "version_question",
          key: "id"
        }
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
      owner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id"
        }
      },
      version_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "version",
          key: "id"
        }
      },
      // sequelize hierarchy
      hierarchyLevel: {
        type: Sequelize.INTEGER
      },
      parentId: {
        type: Sequelize.INTEGER,
        references: {
          model: "comment",
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
    return queryInterface.dropTable("comments");
  }
};
