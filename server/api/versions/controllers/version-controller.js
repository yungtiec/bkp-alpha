const db = require("../../../db");
const { Project, Version, VersionAnswer } = require("../../../db/models");

const getMetadata = async (req, res, next) => {
  try {
    const version = await Version.scope({
      method: ["basic", req.params.versionId]
    }).findOne();
    res.send(version);
  } catch (err) {
    next(err);
  }
};

const putScorecard = async (req, res, next) => {
  try {
    const version = await Version.findById(req.params.versionId).then(v =>
      v.update({ scorecard: req.body.scorecard })
    );
    res.send(version.scorecard);
  } catch (err) {
    next(err);
  }
};

const putContentJson = async (req, res, next) => {
  try {
    const version = await Version.findById(req.params.versionId).then(v =>
      v.update({ content_json: req.body.content_json })
    );
    res.send(version.content_json);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMetadata,
  putScorecard,
  putContentJson
};
