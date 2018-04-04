const router = require("express").Router();
const { Annotation } = require("../db/models");
const { assignIn, pick } = require("lodash");
const { ensureAuthentication } = require("./utils");
module.exports = router;

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
      survey_question_id
    } = req.body;
    const newAnnotation = await Annotation.create({
      uri,
      survey_question_id,
      quote: quote.replace("\n  \n\n  \n    \n    \n      Cancel\nSave", ""),
      comment: text,
      ranges,
      annotator_schema_version
    });
    await newAnnotation.setOwner(req.user.id);
    res.send(newAnnotation);
  } catch (err) {
    next(err);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const annotations = await Annotation.findAll({
      where: {
        uri: req.query.uri,
        survey_question_id: req.query.survey_question_id
      }
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
