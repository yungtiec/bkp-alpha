const Sequelize = require("sequelize");
const router = require("express").Router();
const db = require("../db");
const { Comment, Issue } = require("../db/models");
const moment = require("moment");
const _ = require("lodash");
const { ensureAuthentication } = require("./utils");
Promise = require("bluebird");
module.exports = router;

router.get("/", ensureAuthentication, async (req, res, next) => {
  try {
    console.log(req.query);
    var issues = await Comment.findAndCountAll({
      where: {
        version_id: {
          [Sequelize.Op.or]: (req.query.versionIds || []).map(id => Number(id))
        }
      },
      include: [
        {
          where: { open: true },
          model: Issue,
          required: true
        },
        {
          model: db.model("user"),
          as: "owner",

          attributes: ["first_name", "last_name", "name", "email", "anonymity"]
        },
        {
          model: db.model("version"),
          attributes: ["document_id", "id"],
          include: [
            {
              model: db.model("document"),
              attributes: ["project_id", "title"],
              include: [
                {
                  model: db.model("project"),
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
    });
    res.send(issues);
  } catch (err) {
    next(err);
  }
});
