"use strict";
module.exports = (db, DataTypes) => {
  const ProjectEditor = db.define(
    "project_editor",
    {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id"
        }
      },
      project_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "project",
          key: "id"
        }
      }
    },
    {}
  );
  ProjectEditor.associate = function(models) {
    // associations can be defined here
  };
  return ProjectEditor;
};
