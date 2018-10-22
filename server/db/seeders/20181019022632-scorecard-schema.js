"use strict";
var stepArray = require("../../../json-schema/step-array.json");
var stepSchemasJson = require("../../../json-schema/step-schemas.json");

console.log(typeof stepArray);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "wizard_schemas",
      [
        {
          step_array_json: stepArray,
          step_schemas_json: stepSchemasJson,
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
    return queryInterface.bulkDelete("wizard_schemas", { id: 1 }, {});
  }
};
