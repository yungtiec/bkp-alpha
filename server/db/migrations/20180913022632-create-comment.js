"use strict";
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable("comments", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uri: {
        type: DataTypes.STRING
      },
      version_question_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "version_question",
          key: "id"
        }
      },
      version_answer_id: {
        type: DataTypes.INTEGER
      },
      quote: {
        type: DataTypes.TEXT
      },
      comment: {
        type: DataTypes.TEXT
      },
      annotator_schema_version: {
        type: DataTypes.STRING
      },
      ranges: {
        type: DataTypes.ARRAY(DataTypes.JSON)
      },
      upvotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      reviewed: {
        type: DataTypes.ENUM("pending", "spam", "verified"),
        defaultValue: "pending"
      },
      owner_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id"
        }
      },
      version_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "version",
          key: "id"
        }
      },
      // sequelize hierarchy
      hierarchyLevel: {
        type: DataTypes.INTEGER
      },
      parentId: {
        type: DataTypes.INTEGER,
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
