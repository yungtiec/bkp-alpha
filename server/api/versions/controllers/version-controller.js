const db = require("../../../db");
const {
  Project,
  Version,
  VersionAnswer,
  Document
} = require("../../../db/models");

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

const getDrafts = async (req, res, next) => {
  try {
    var { count, rows } = await Document.scope({
      method: [
        "includeVersions",
        {
          versionWhereClause: { submitted: false }
        }
      ]
    }).findAndCountAll({
      where: { creator_id: req.user.id },
      limit: Number(req.query.limit),
      offset: Number(req.query.offset)
    });
    rows = rows.map(d => {
      d = d.toJSON();
      return d.versions[0];
    });
    res.send({ count, rows });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMetadata,
  putScorecard,
  putContentJson,
  getDrafts
};
