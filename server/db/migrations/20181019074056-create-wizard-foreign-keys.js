"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("wizard_schemas", "parentId", {
        type: Sequelize.INTEGER,
        references: {
          model: "wizard_schemas",
          key: "id"
        }
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [queryInterface.removeColumn("wizard_schemas", "parentId")];
  }
};
