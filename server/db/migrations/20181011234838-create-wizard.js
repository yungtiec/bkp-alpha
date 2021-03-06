"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("wizard_schemas", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        step_array_json: Sequelize.JSON,
        step_schemas_json: Sequelize.JSON,
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
      })
      .then(() => {
        return queryInterface.addColumn("versions", "wizard_schema_id", {
          type: Sequelize.INTEGER,
          references: {
            model: "wizard_schemas",
            key: "id"
          }
        });
      })
      .then(() => {
        return queryInterface.addColumn("versions", "content_json", {
          type: Sequelize.JSON
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn("versions", "wizard_schema_id"),
      queryInterface.removeColumn("versions", "content_json"),
      queryInterface.dropTable("wizard_schemas")
    ];
  }
};
