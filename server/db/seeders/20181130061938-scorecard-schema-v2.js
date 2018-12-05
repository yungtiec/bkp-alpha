"use strict";
var generateStepArrays = require("../../../json-schema/generateStepArrays");
var experimentStepSchemasJson = require("../../../json-schema/experimentStepSchemasJson");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "wizard_schemas",
      [
        {
          step_array_json: generateStepArrays(),
          step_schemas_json: experimentStepSchemasJson(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {},
      {
        // queryInterface is not a sequelize instacne, it's a lower level API so need to define datatype here
        step_array_json: { type: new Sequelize.JSON() },
        step_schemas_json: { type: new Sequelize.JSON() }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkDelete("wizard_schemas", { id: 1 }, {})
      .then(() =>
        queryInterface.sequelize.query(
          `ALTER SEQUENCE "wizard_schemas_id_seq" RESTART WITH ${1};`
        )
      );
  }
};
