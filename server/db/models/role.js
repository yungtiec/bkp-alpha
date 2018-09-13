"use strict";
module.exports = (db, DataTypes) => {
  const Role = db.define(
    "role",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      }
    },
    {}
  );
  Role.associate = function(models) {
    // associations can be defined here
  };
  return Role;
};
