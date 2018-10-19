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
          step_schemas_json: stepSchemasJson
        }
      ],
      {},
      {
        step_array_json: { type: new Sequelize.JSON() },
        step_schemas_json: { type: new Sequelize.JSON() }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("wizard_schemas", [
      { step_array_json: stepArray }
      // apparently you can do array in field equality check in sequelize
      // see here:
      // https://www.bennadel.com/blog/3302-you-can-use-arrays-in-field-equality-checks-within-a-sequelize-where-clause-in-node-js.htm
    ]);
  }
};
