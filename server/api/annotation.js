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
    var ancestry;
    const parent = await Annotation.findById(Number(req.body.parentId));
    const child = _.assignIn(
      _.omit(parent.toJSON(), [
        "id",
        "createdAt",
        "updatedAt",
        "hierarchyLevel",
        "parentId",
        "text"
      ]),
      { text: req.body.comment }
    );
    const ancestors = await parent.getAncestors({raw: true});
    var rootAncestor = _.orderBy(ancestors, ['hierarchyLevel'], ['asc'])[0]
    var reply = await Annotation.create(child);
    reply = await reply.setParent(parent.toJSON().id);
    ancestry = await Annotation.findOne({
      where: { id: rootAncestor ? rootAncestor.id : parent.id },
      include: {
        model: Annotation,
        as: "descendents",
        hierarchy: true
      }
    });
    res.send(ancestry);
  } catch (err) {
    next(err);
  }
});
