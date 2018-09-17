const Sequelize = require("sequelize");
const db = require("../../db");
const {
  Comment,
  Issue,
  User,
  Version,
  Document,
  Project
} = require("../../db/models");
const moment = require("moment");
const _ = require("lodash");
Promise = require("bluebird");

const getIssues = async (req, res, next) => {
  try {
    var issues;
    issues =
      req.query.versionIds && req.query.versionIds.length
        ? await Comment.findAndCountAll({
            where: {
              version_id: {
                [Sequelize.Op.or]: (req.query.versionIds || []).map(id =>
                  Number(id)
                )
              }
            },
            include: [
              {
                where: { open: true },
                model: Issue,
                required: true
              },
              {
                model: User,
                as: "owner",

                attributes: [
                  "first_name",
                  "last_name",
                  "name",
                  "email",
                  "anonymity"
                ]
              },
              {
                model: Version,
                attributes: ["document_id", "id"],
                include: [
                  {
                    model: Document,
                    attributes: ["project_id", "title"],
                    include: [
                      {
                        model: Project,
                        attributes: ["symbol"]
                      }
                    ]
                  }
                ]
              }
            ],
            order: [["createdAt", "DESC"]],
            offset: Number(req.query.offset),
            limit: Number(req.query.limit)
          })
        : { count: 0, rows: [] };
    res.send(issues);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getIssues
};
