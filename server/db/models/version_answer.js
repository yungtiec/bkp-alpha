"use strict";
module.exports = (db, DataTypes) => {
  const VersionAnswer = db.define("version_answer", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    markdown: {
      type: DataTypes.TEXT
    },
    latest: {
      type: DataTypes.BOOLEAN
    }
  });
  VersionAnswer.isHierarchy();
  VersionAnswer.associate = function(models) {
    VersionAnswer.belongsTo(models.version_question, {
      foreignKey: "version_question_id"
    });
  };
  return VersionAnswer;
};
