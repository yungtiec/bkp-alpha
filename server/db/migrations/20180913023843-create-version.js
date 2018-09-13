'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('versions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      document_id: {
        type: Sequelize.INTEGER
      },
      submitted: {
        type: Sequelize.BOOLEAN
      },
      reviewed: {
        type: Sequelize.BOOLEAN
      },
      comment_until_unix: {
        type: Sequelize.BIGINT
      },
      scorecard: {
        type: Sequelize.JSONB
      },
      version_number: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('versions');
  }
};