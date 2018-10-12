"use strict";
module.exports = (sequelize, DataTypes) => {
  const Wizard = sequelize.define("wizard", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    step_array: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    step_schemas_json: {
      type: DataTypes.JSON
    },
  });

  Wizard.isHierarchy();
  Wizard.associate = function(models) {
    Wizard.belongsTo(models.version, {
      foreignKey: "wizard_schemas_id"
    });
  };
  return Wizard;
};
