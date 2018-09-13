"use strict";
module.exports = (db, DataTypes) => {
  const VersionAnswer = db.define("version_answer", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    version_question_id: {
      type: DataTypes.INTEGER
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
    VersionAnswer.belongsTo(models.VersionQuestion, {
      foreignKey: "version_question_id"
    });
  };
  return VersionAnswer;
};
