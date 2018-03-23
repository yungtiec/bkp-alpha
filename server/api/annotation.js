const router = require("express").Router();
const { Annotation } = require("../db/models");
const _ = require("lodash");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const annotations = await Annotation.findAll({
      where: { uri: req.query.uri, parentId: null },
      include: {
        model: Annotation,
        as: "descendents",
        hierarchy: true
      }
    });
    res.send(annotations);
  } catch (err) {
    next(err);
  }
});

router.post("/reply", async (req, res, next) => {
  try {
    const child = _.assignIn(
      _.omit(req.body.parent, [
        "id",
        "createdAt",
        "updatedAt",
        "hierarchyLevel",
        "parentId",
        "text"
      ]),
      {text: req.body.comment}
    );
    var reply = await Annotation.create(child)
    reply = await reply.setParent(req.body.parent.id);
    res.send(reply)
  } catch (err) {
    next(err);
  }
});
