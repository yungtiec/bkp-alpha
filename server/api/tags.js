const router = require("express").Router();
const { Tag } = require("../db/models");
const { ensureAuthentication } = require("./utils");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const tags = await Tag.findAll();
    res.send(tags);
  } catch (err) {
    next(err);
  }
});

router.get("/autocomplete", async (req, res, next) => {
  try {
    const tags = await Tag.findAll({
      where: { name: { [Op.iLike]: `%${req.query.term}%` } }
    });
    res.send(
      tags.map(tag => ({ id: tag.id, label: tag.name, value: tag.name }))
    );
  } catch (err) {
    next(err);
  }
});
