const { IncomingWebhook } = require("@slack/client");
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(slackWebhookUrl);

const postFeedback = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production")
      webhook.send(req.body.feedback, function(err, result) {
        if (err) {
          next(err);
        } else {
          res.sendStatus(200);
        }
      });
    else res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postFeedback
}
