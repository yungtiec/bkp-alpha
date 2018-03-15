const Sequelize = require("sequelize");
const db = require("../db");

const Annotation = db.define("annotation", {
  uri: {
    type: Sequelize.STRING,
    allowNull: false
  },
  quote: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  text: {
    type: Sequelize.TEXT
  },
  annotator_schema_version: {
    type: Sequelize.STRING
  },
  ranges: {
    type: Sequelize.ARRAY(Sequelize.JSON)
  }
});

module.exports = Annotation;
