const router = require("express").Router({ mergeParams: true });
const db = require("../../db");
const { Project, Version, VersionAnswer } = require("../../db/models");
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

router.put("/:id/scorecard", async (req, res, next) => {
  try {
    const version = await Version.findById(req.params.id).then(v =>
      v.update({ scorecard: req.body.scorecard })
    );
    res.send(version.scorecard);
  } catch (err) {
    next(err);
  }
});

router.use("/:versionId/questions", require("./questions"));
router.use("/:versionId/answers", require("./answers"));

router.use("/:versionId/comments", require("./comments"));
router.use("/:versionId/annotator", require("./annotator"));
