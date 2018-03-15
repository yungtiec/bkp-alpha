const router = require("express").Router();
const { Annotation } = require("../db/models");
module.exports = router;

router.get("/", (req, res, next) => {
  res.send({
    name: "Annotator Store API",
    version: "2.0.0"
  });
});

router.post("/store", async (req, res, next) => {
  try {
    const { ranges, quote, text, uri, annotator_schema_version } = req.body;
    const newAnnotation = await Annotation.findOrCreate({
      where: {
        uri
      },
      defaults: {
        quote,
        text,
        ranges,
        annotator_schema_version
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get("/annotations", async (req, res, next) => {
  try {
    const annotations = await Annotation.findAll({
      where: { uri: req.query.uri }
    }).map(annotation => {
      return annotation.toJSON();
    });
    res.send(annotations);
  } catch (err) {
    next(err);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const annotations = await Annotation.findAll({
      where: { uri: req.query.uri }
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
