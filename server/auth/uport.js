const router = require("express").Router();
const { User, Role } = require("../db/models");
module.exports = router;

router.post("/", async (req, res, next) => {
  try {
    var user = await User.findOne({
      where: { uportAddress: req.body.address }
    });
    console.log(req.body)
    if (user)
      user = await User.getContributions({ uportAddress: req.body.address });
    else
      user = await User.create({
        name: req.body.name,
        uportAddress: req.body.address
      }).then(user =>
        User.getContributions({ uportAddress: req.body.address })
      );
    req.login(user, async err => {
      if (err) next(err);
      res.send(user);
    });
  } catch (err) {
    next(err);
  }
});
