const router = require("express").Router({ mergeParams: true });
const db = require("../../db");
const { Project, Version } = require("../../db/models");
Promise = require("bluebird");
module.exports = router;

router.get("/:id/metadata", async (req, res, next) => {
  try {
    const version = await Version.scope({
      method: ["byIdWithMetadata", req.params.id]
    }).findOne();
    res.send(version);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/questions", async (req, res, next) => {
  try {
    const version = await Version.scope({
      method: ["byIdWithVersionQuestions", req.params.id]
    }).findOne();
    res.send(version);
  } catch (err) {
    next(err);
  }
});

router.use("/versions/:versionId/comments", require("./comments"));
router.use("/versions/:versionId/annotator", require("./annotator"));
