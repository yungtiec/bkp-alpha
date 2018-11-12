const router = require("express").Router({ mergeParams: true });
const { ensureAuthentication } = require("../utils");
const feedbackController = require("./controller");
module.exports = router;

/**
 * Sending feedback or bug report to designated slack channel
 *
 * @name Post feedby
 * @route {POST} /api/feedback
 * @authentication
 * @bodyparam {String} feedback
 *
 */
router.post("/", ensureAuthentication, feedbackController.postFeedback);

router.post(
  "/propose-collaboration",
  ensureAuthentication,
  feedbackController.requestForArticleToBeFeatured
);
