const router = require("express").Router();
const issueController = require("./controller");
const { ensureAuthentication } = require("../utils");
module.exports = router;

router.get("/", ensureAuthentication, issueController.getIssues);
