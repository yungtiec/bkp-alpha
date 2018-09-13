"use strict";
module.exports = (db, DataTypes) => {
  const ProjectAdmin = db.define("project_admin", {
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
  });
  ProjectAdmin.associate = function(models) {
    // associations can be defined here
  };
  return ProjectAdmin;
};
