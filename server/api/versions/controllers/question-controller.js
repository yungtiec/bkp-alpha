const db = require("../../../db");
const {
  Version,
  VersionQuestion,
  VersionAnswer,
  Comment
} = require("../../../db/models");
const permission = require("../../../access-control")["Disclosure"];
const _ = require("lodash");
Promise = require("bluebird");

const getQuestions = async (req, res, next) => {
  try {
    var rawVersion = await Version.scope({
      method: ["byIdWithVersionQuestions", req.params.versionId]
    }).findOne();
    var version_questions = rawVersion.version_questions.map(vq => {
      vq = addHistory(vq);
      vq.version_answers[0] = addHistory(vq.version_answers[0]);
      return vq;
    });
    var version = _.assignIn(rawVersion.toJSON(), { version_questions });
    res.send(version);
  } catch (err) {
    next(err);
  }
};

const postQuestion = async (req, res, next) => {
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
    var currentVersionQuestion = await VersionQuestion.findOne({
      where: { id: req.body.versionQuestionId },
      include: [{ model: VersionQuestion, as: "descendents", require: false }],
      order: [
        [
          { model: VersionQuestion, as: "descendents" },
          "hierarchyLevel",
          "DESC"
        ]
      ]
    });
    var latestVersionQuestion =
      currentVersionQuestion.descendents &&
      currentVersionQuestion.descendents.length
        ? currentVersionQuestion.descendents[0]
        : currentVersionQuestion;
    var [newlyAddedVersionQuestion, currentVersionQuestion] = await Promise.all(
      [
        VersionQuestion.create({
          version_id: latestVersionQuestion.version_id,
          order_in_version: latestVersionQuestion.order_in_version,
          markdown: req.body.markdown,
          latest: true
        }).then(async nq => {
          await nq.setParent(latestVersionQuestion.id);
          return nq;
        }),
        currentVersionQuestion.update({ latest: false })
      ]
    );
    var [versionAnswers, comments] = await Promise.all([
      VersionAnswer.update(
        { version_question_id: newlyAddedVersionQuestion.id },
        { where: { version_question_id: req.body.versionQuestionId } }
      ),
      Comment.update(
        { version_question_id: newlyAddedVersionQuestion.id },
        { where: { version_question_id: req.body.versionQuestionId } }
      )
    ]);
    newlyAddedVersionQuestion = await VersionQuestion.scope({
      method: ["withAncestorsAndVersionAnswers", newlyAddedVersionQuestion.id]
    }).findOne();
    newlyAddedVersionQuestion = addHistory(newlyAddedVersionQuestion);
    newlyAddedVersionQuestion.version_answers[0] = addHistory(
      newlyAddedVersionQuestion.version_answers[0]
    );
    res.send(newlyAddedVersionQuestion);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const putQuestion = async (req, res, next) => {
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
  var [versionAnswer, prevVersionQuestion] = await Promise.all([
    (VersionAnswer.update(
      { version_question_id: req.body.versionQuestionId },
      { where: { version_question_id: req.body.prevVersionQuestionId } }
    ),
    VersionQuestion.update(
      { latest: false },
      { where: { id: req.body.prevVersionQuestionId } }
    ))
  ]);
  var versionQuestion = await VersionQuestion.scope({
    method: ["withVersionAnswers", req.body.versionQuestionId]
  })
    .findOne()
    .then(vq => vq.update({ latest: true }));
  versionQuestion = versionQuestion.toJSON();
  versionQuestion.version_answers[0] = addHistory(
    versionQuestion.version_answers[0]
  );
  res.send(versionQuestion);
};

const addHistory = versionQuestionOrAnswer => {
  versionQuestionOrAnswer = versionQuestionOrAnswer.toJSON
    ? versionQuestionOrAnswer.toJSON()
    : versionQuestionOrAnswer;
  versionQuestionOrAnswer.history = (versionQuestionOrAnswer.ancestors || [])
    .concat([_.omit(versionQuestionOrAnswer, ["ancestors"])])
    .concat(versionQuestionOrAnswer.descendents || []);
  delete versionQuestionOrAnswer["ancestors"];
  delete versionQuestionOrAnswer["descendents"];
  return versionQuestionOrAnswer;
};

module.exports = {
  getQuestions,
  postQuestion,
  putQuestion
};
