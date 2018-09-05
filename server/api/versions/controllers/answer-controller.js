const db = require("../../../db");
const {
  Version,
  VersionQuestion,
  VersionAnswer
} = require("../../../db/models");
const permission = require("../../../access-control")["Disclosure"];
const _ = require("lodash");
Promise = require("bluebird");

const postAnswer = async (req, res, next) => {
  try {
    var version = await Version.scope({
      method: ["byIdWithMetadata", Number(req.params.versionId)]
    }).findOne();
    const canVersion = permission(
      "Version",
      { project: version.document.project, disclosure: version.document },
      req.user
    );
    if (!canVersion) {
      res.sendStatus(403);
      return;
    }
    var currentVersionAnswer = await VersionAnswer.findOne({
      where: { id: req.body.versionAnswerId },
      include: [{ model: VersionAnswer, as: "descendents", require: false }],
      order: [
        [{ model: VersionAnswer, as: "descendents" }, "hierarchyLevel", "DESC"]
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
      }).then(async na => {
        await na.setParent(latestVersionAnswer.id);
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
          attributes: ["id", "createdAt"],
          required: false
        },
        {
          model: db.model("version_answer"),
          as: "descendents",
          attributes: ["id", "createdAt"],
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
    newlyAddedVersionAnswer = newlyAddedVersionAnswer.toJSON();
    newlyAddedVersionAnswer.history = (newlyAddedVersionAnswer.ancestors || [])
      .concat(_.omit(newlyAddedVersionAnswer, ["ancestors"]))
      .concat(newlyAddedVersionAnswer.descendents || []);
    res.send(newlyAddedVersionAnswer);
  } catch (err) {
    next(err);
  }
};

const putAnswer = async (req, res, next) => {
  try {
    var version = await Version.scope({
      method: ["byIdWithMetadata", Number(req.params.versionId)]
    }).findOne();
    const canVersion = permission(
      "Version",
      { project: version.document.project, disclosure: version.document },
      req.user
    );
    if (!canVersion) {
      res.sendStatus(403);
      return;
    }
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
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postAnswer,
  putAnswer
};
