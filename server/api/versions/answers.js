const router = require("express").Router({ mergeParams: true });
const db = require("../../db");
const { Version, VersionQuestion, VersionAnswer } = require("../../db/models");
const _ = require("lodash");
Promise = require("bluebird");
module.exports = router;

router.post("/", async (req, res, next) => {
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
      newlyAddedVersionAnswer = await VersionAnswer.findOne({
        where: { id: newlyAddedVersionAnswer.id },
        include: [
          {
            model: db.model("version_answer"),
            as: "ancestors",
            attribute: ["id", "createdAt"],
            required: false
          },
          {
            model: db.model("version_answer"),
            as: "descendents",
            attribute: ["id", "createdAt"],
            required: false
          }
        ],
        order: [
          [
            {
              model: db.model("version_answer"),
              as: "descendents"
            },
            "hierarchyLevel",
            "DESC"
          ],
          [
            {
              model: db.model("version_answer"),
              as: "ancestors"
            },
            "hierarchyLevel",
            "DESC"
          ]
        ]
      });
      newlyAddedVersionAnswer.history = newlyAddedVersionAnswer.ancestors
        .concat(_.omit(newlyAddedVersionAnswer, ["ancestors"]))
        .concat(newlyAddedVersionAnswer.descendents);
      delete newlyAddedVersionAnswer["ancestors"];
      delete newlyAddedVersionAnswer["descendents"];
      res.send(newlyAddedVersionAnswer);
    } else {
      var [prevVersionAnswer, versionAnswer] = await Promise.all([
        VersionAnswer.update(
          { latest: false },
          { where: { id: req.body.prevVersionAnswerId } }
        ),
        VersionAnswer.update(
          { latest: true },
          { where: { id: req.body.versionAnswerId } }
        ).then(() => VersionAnswer.findById(req.body.versionAnswerId))
      ]);
      res.send(versionAnswer);
    }
  } catch (err) {
    next(err);
  }
});
