const router = require("express").Router();
const { Annotation, Tag, Issue } = require("../db/models");
const { assignIn, pick } = require("lodash");
const { ensureAuthentication } = require("./utils");
const { IncomingWebhook } = require("@slack/client");
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(slackWebhookUrl);
Promise = require("bluebird");
module.exports = router;

function sendNotificationToSlack(annotation) {
  // Send simple text to the webhook channel
  if (process.env.NODE_ENV === "production")
    webhook.send(
      `Incoming annotation at ${annotation.uri}/question/${
        annotation.survey_question_id
      }/annotation/${
        annotation.id
      }\nor view it in your admin panel at https://tbp-annotator.herokuapp.com/admin`,
      function(err, res) {
        if (err) {
          console.log("Error:", err);
        } else {
          console.log("Message sent: ", res);
        }
      }
    );
}

router.get("/", (req, res, next) => {
  res.send({
    name: "Annotator Store API",
    version: "2.0.0"
  });
});

router.post("/store", ensureAuthentication, async (req, res, next) => {
  try {
    const {
      ranges,
      quote,
      text,
      uri,
      annotator_schema_version,
      survey_question_id,
      tags,
      issue
    } = req.body;
    var newAnnotation = await Annotation.create({
      uri,
      survey_question_id,
      quote: quote.replace("\n  \n\n  \n    \n    \n      Cancel\nSave", ""),
      comment: text,
      ranges,
      annotator_schema_version
    });
    const issuePromise = issue
      ? Issue.create({
          open: true,
          annotationId: newAnnotation.id
        })
      : null;
    const tagPromises = Promise.map(tags, async tag => {
      const [tagInstance, created] = await Tag.findOrCreate({
        where: { name: tag }
      });
      return newAnnotation.addTag(tagInstance.id);
    });
    const ownerPromise = newAnnotation.setOwner(req.user.id);
    await Promise.all([tagPromises, ownerPromise, issuePromise]);
    newAnnotation = await Annotation.findOneThreadByRootId(newAnnotation.id);
    sendNotificationToSlack(newAnnotation);
    res.send(newAnnotation);
  } catch (err) {
    next(err);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    var annotations = await Annotation.findAll({
      where: {
        uri: req.query.uri,
        survey_question_id: req.query.survey_question_id,
        reviewed: { $not: "spam" }
      },
      include: [
        {
          model: Tag,
          attributes: ["name", "id"]
        }
      ]
    }).map(annotation => {
      return annotation.toJSON();
    });
    res.send({
      rows: annotations,
      total: annotations.length
    });
  } catch (err) {
    next(err);
  }
});
