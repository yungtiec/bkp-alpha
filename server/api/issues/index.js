const router = require("express").Router();
const issueController = require("./controller");
const { ensureAuthentication } = require("../utils");
module.exports = router;

/**
 * Getting a list of issues
 *
 * @name Get issus by version ids
 * @route {GET} /api/issues
 * @authentication
 * @queryparam {Array} versionIds
 * @queryparam {Number} limit
 * @queryparam {Number} offset
 *
 */
router.get("/", ensureAuthentication, issueController.getIssues);
