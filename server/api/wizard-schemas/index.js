const router = require("express").Router();
const wizardSchemaController = require("./controller");
const { ensureAuthentication, ensureAdminRole } = require("../utils");
module.exports = router;

/**
 * Getting a wizard schema by id
 *
 * @name Get wizard schema by id
 * @route {GET} /api/wizard-schema
 * @todo pagination
 *
 */
router.get("/:wizardSchemaId", wizardSchemaController.getWizardSchemaById);
