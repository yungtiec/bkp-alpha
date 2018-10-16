"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn("documents", "document_type", {
        type: Sequelize.TEXT
      })
      .then(() => {
        return Promise.all([
          queryInterface.sequelize.query(
            "UPDATE documents SET document_type = 'general' WHERE document_id = 1;"
          ),
          queryInterface.sequelize.query(
            "UPDATE documents SET document_type = 'scorecard' WHERE document_id = 2;"
          )
        ]);
      });
  },

  down: (queryInterface, Sequelize) => {
    return [queryInterface.removeColumn("documents", "document_type")];
  }
};
