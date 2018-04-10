const router = require("express").Router();
const { Tag } = require("../db/models");
const { ensureAuthentication } = require("./utils");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const tags = await Tag.findAll();
    res.send(tags);
  } catch (err) {
    next(err);
  }
});
