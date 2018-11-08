const { IncomingWebhook } = require("@slack/client");
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(slackWebhookUrl);
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

const requestForArticleToBeFeatured = async (req, res, next) => {
  const message = {
    to: ["nicolaas.koster@consensys.net", "patrick.berarducci@consensys.net"],
    from: "The Brooklyn Project <bot@thebkp.com>",
    subject: "The Brooklyn Project - collaboration proposal",
    text: `email: ${req.body.email}\narticle link: ${req.body.link}\nmessage: ${
      req.body.message
    }`
  };
  await sgMail.send(message);
  res.send(200);
};

module.exports = {
  postFeedback,
  requestForArticleToBeFeatured
};
