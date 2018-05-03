const Sequelize = require("sequelize");
const db = require("../db");
const router = require("express").Router();
const { User, Role, Annotation } = require("../db/models");
const { assignIn } = require("lodash");
const {
  ensureAuthentication,
  ensureAdminRole,
  ensureAdminRoleOrOwnership
} = require("./utils");
module.exports = router;

router.get(
  "/:userId",
  ensureAuthentication,
  ensureAdminRoleOrOwnership,
  async (req, res, next) => {
    try {
      const profile = await User.getContributions(Number(req.params.userId));
      res.send(profile);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:userId/annotations",
  ensureAuthentication,
  ensureAdminRoleOrOwnership,
  async (req, res, next) => {
    var queryObj = {
      userId: Number(req.params.userId),
      limit: Number(req.query.limit),
      offset: Number(req.query.limit) * Number(req.query.offset),
      reviewStatus: {
        [Sequelize.Op.or]: [
          { [Sequelize.Op.eq]: "pending" },
          { [Sequelize.Op.eq]: "verified" },
          { [Sequelize.Op.eq]: "spam" }
        ]
      }
    };
    if (req.query.reviewStatus && req.query.reviewStatus.length) {
      queryObj.reviewStatus = {
        [Sequelize.Op.or]: req.query.reviewStatus.map(status => ({
          [Sequelize.Op.eq]: status
        }))
      };
    }

    try {
      const profile = await User.scope({
        method: ["annotations", queryObj]
      }).findOne();
      res.send(profile.annotations || []);
    } catch (err) {
      next(err);
    }
  }
);
