const Sequelize = require("sequelize");
const db = require("../db");

const Annotation = db.define("annotation", {
  uri: {
    type: Sequelize.STRING,
    allowNull: false
  },
  survey_question_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  survey_answer_id: {
    type: Sequelize.INTEGER
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
  },
  upvotes: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
    hierarchy: true
});
// Annotation.isHierarchy()

module.exports = Annotation;

