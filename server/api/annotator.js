const router = require("express").Router();
const { Annotation } = require("../db/models");
const { assignIn, pick } = require("lodash");
module.exports = router;

router.get("/", (req, res, next) => {
  res.send({
    name: "Annotator Store API",
    version: "2.0.0"
  });
});

router.post("/store", async (req, res, next) => {
  if (!req.user) res.sendStatus(401);
  else {
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
        quote,
        uri,
        survey_question_id,
        quote,
        text,
        ranges,
        annotator_schema_version
      });
      await newAnnotation.setOwner(req.user.id);
      var io = req.app.get("io");
      io.sockets.emit(
        "annotationAdded",
        assignIn(
          {owner: pick(req.user, ["first_name", "last_name", "email"])},
          newAnnotation.toJSON()
        )
      );
      res.send(newAnnotation);
    } catch (err) {
      next(err);
    }
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
