const router = require("express").Router();
const { Project, ProjectSurvey, Survey, User } = require("../db/models");
const db = require("../db");
const { ensureAuthentication } = require("./utils");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
module.exports = router;

router.get("/:symbol", async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: { symbol: req.params.symbol },
      include: [
        {
          model: ProjectSurvey,
          include: [
            {
              model: Survey
            }
          ]
        }
      ]
    });
    res.send(project);
  } catch (err) {
    next(err);
  }
});
