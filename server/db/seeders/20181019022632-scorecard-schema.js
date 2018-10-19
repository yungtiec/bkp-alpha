"use strict";
var stepArray = require("../../../json-schema/step-array.json");
var stepSchemasJson = require("../../../json-schema/step-schemas.json");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "wizard_schema",
      [
        {
          step_array: stepArray.steps,
          step_schemas_json: stepSchemasJson
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("wizard_schema", [
      { step_array: stepArray.steps }
      // apparently you can do array in field equality check in sequelize
      // see here:
      // https://www.bennadel.com/blog/3302-you-can-use-arrays-in-field-equality-checks-within-a-sequelize-where-clause-in-node-js.htm
    ]);
  }
};
