"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("wizard_schemasancestors", {
      wizard_schemaId: {
        type: Sequelize.INTEGER,
        references: {
          model: "wizard_schemas",
          key: "id"
        }
      },
      ancestorId: {
        type: Sequelize.INTEGER,
        references: {
          model: "wizard_schemas",
          key: "id"
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("wizard_schemasancestors");
  }
};

// merge
