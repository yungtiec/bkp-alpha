const router = require("express").Router({ mergeParams: true });
const db = require("../../db");
const { Version, VersionQuestion, VersionAnswer } = require("../../db/models");
Promise = require("bluebird");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const version = await Version.scope({
      method: ["byIdWithVersionQuestions", req.params.versionId]
    }).findOne();
    res.send(version);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!req.body.reverting) {
      var currentVersionQuestion = await VersionQuestion.findOne({
        where: { id: req.body.versionQuestionId },
        include: [
          { model: VersionQuestion, as: "descendents", require: false }
        ],
        order: [
          [
            { model: VersionQuestion, as: "descendents" },
            "hierarchyLevel",
            "DESC"
          ]
        ]
      });
      var latestVersionQuestion =
        currentVersionQuestion.descendants &&
        currentVersionQuestion.descendants.length
          ? currentVersionQuestion.descendants[0]
          : currentVersionQuestion;
      var [
        newlyAddedVersionQuestion,
        currentVersionQuestion
      ] = await Promise.all([
        VersionQuestion.create({
          version_id: latestVersionQuestion.version_id,
          order_in_version: latestVersionQuestion.order_in_version,
          markdown: req.body.markdown,
          latest: true
        }).then(nq => {
          nq.setParent(latestVersionQuestion.id);
          return nq;
        }),
        currentVersionQuestion.update({ latest: false })
      ]);
      var versionAnswer = await VersionAnswer.update(
        { version_question_id: newlyAddedVersionQuestion.id },
        { where: { version_question_id: req.body.versionQuestionId } }
      );
      newlyAddedVersionQuestion = await VersionQuestion.findOne({
        where: { id: newlyAddedVersionQuestion.id },
        include: [
          {
            model: VersionAnswer,
            where: { latest: true }
          },
          { model: VersionQuestion, as: "ancestors" }
        ],
        order: [
          [
            { model: VersionQuestion, as: "ancestors" },
            "hierarchyLevel",
            "DESC"
          ]
        ]
      });
      res.send(newlyAddedVersionQuestion);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});
