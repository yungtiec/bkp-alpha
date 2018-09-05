const router = require("express").Router();
const { ensureAuthentication } = require("../utils");
const tagController = require("./controller")
module.exports = router;

router.get("/", tagController.getTags);

router.get("/autocomplete", tagController.getAutocompleteTags);
