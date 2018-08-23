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

router.post("/:versionId/answers", async (req, res, next) => {
  try {
    if (!req.body.reverting) {
      var currentVersionAnswer = await VersionAnswer.findOne({
        where: { id: req.body.versionAnswerId },
        include: [{ model: VersionAnswer, as: "descendents", require: false }],
        order: [
          [
            { model: VersionAnswer, as: "descendents" },
            "hierarchyLevel",
            "DESC"
          ]
        ]
      });
      var latestVersionAnswer =
        currentVersionAnswer.descendants &&
        currentVersionAnswer.descendants.length
          ? currentVersionAnswer.descendants[0]
          : currentVersionAnswer;
      var [newlyAddedVersionAnswer, currentVersionAnswer] = await Promise.all([
        VersionAnswer.create({
          version_id: latestVersionAnswer.version_id,
          version_question_id: latestVersionAnswer.version_question_id,
          markdown: req.body.markdown,
          latest: true
        }).then(na => {
          na.setParent(latestVersionAnswer.id);
          return na;
        }),
        currentVersionAnswer.update({ latest: false })
      ]);
      res.send(newlyAddedVersionAnswer);
    }
  } catch (err) {
    next(err);
  }
});

router.use("/:versionId/questions", require("./questions"));

router.use("/:versionId/comments", require("./comments"));
router.use("/:versionId/annotator", require("./annotator"));
