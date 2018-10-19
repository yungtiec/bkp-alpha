const { WizardSchema } = require("../../db/models");
const _ = require("lodash");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const getWizardSchemaById = async (req, res, next) => {
  try {
    const wizardSchema = await WizardSchema.findById(req.params.wizardSchemaId);
    res.send(wizardSchema);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWizardSchemaById
};
