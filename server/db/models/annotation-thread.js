const Sequelize = require("sequelize");
const db = require("../db");

const AnnotationThread = db.define("annotation_thread", {
  root_annotation_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  annotation_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
});

module.exports = AnnotationThread
