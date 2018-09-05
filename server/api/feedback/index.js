const router = require("express").Router({ mergeParams: true });
const { ensureAuthentication } = require("../utils");
const feedbackController = require("./controller");
module.exports = router;

router.post("/", ensureAuthentication, feedbackController.postFeedback);
