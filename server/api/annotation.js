const router = require("express").Router();
const { Annotation } = require("../db/models");
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
