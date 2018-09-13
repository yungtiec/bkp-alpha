"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("documents", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING
      },
      forked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        references: {
          model: "document",
          key: "id"
        }
      },
      original_document_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "document",
          key: "id"
        }
      },
      original_version_number: {
        type: DataTypes.INTEGER
      },
      project_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "project",
          key: "id"
        }
      },
      creator_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id"
        }
      },
      latest_version: {
        type: DataTypes.INTEGER
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
    return queryInterface.dropTable("documents");
  }
};
