const router = require("express").Router({ mergeParams: true });
const { ensureAuthentication } = require("./utils");
const { IncomingWebhook } = require("@slack/client");
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(slackWebhookUrl);
module.exports = router;

router.post("/", ensureAuthentication, async (req, res, next) => {
  try {
    console.log(req.body.feedback);
    if (process.env.NODE_ENV === "production")
      webhook.send(req.body.feedback, function(err, res) {
        if (err) {
          next(err);
        } else {
          res.send(200);
        }
      });
    else res.send(200);
  } catch (err) {
    next(err);
  }
});
