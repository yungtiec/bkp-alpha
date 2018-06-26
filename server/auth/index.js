const router = require("express").Router();
const { User, Role } = require("../db/models");
const _ = require("lodash");

module.exports = router;

router.post("/login", async (req, res, next) => {
  User.findOne({
    where: { email: req.body.email },
    include: [
      {
        model: Role,
        attributes: ["name"]
      }
    ]
  })
    .then(user => {
      if (!user) {
        res.status(401).send("User not found");
      } else if (!user.correctPassword(req.body.password)) {
        res.status(401).send("Incorrect password");
      } else {
        req.login(user, async err => {
          if (err) next(err);
          user = await User.getContributions(user.id);
          res.send(user);
        });
      }
    })
    .catch(next);
});

router.post("/signup", (req, res, next) => {
  User.create(req.body)
    .then(async user => {
      user = await User.find({
        where: { id: user.id },
        include: [{ model: Role }]
      });
      req.login(user, err => (err ? next(err) : res.json(user)));
    })
    .catch(err => {
      console.log(err);
      if (err.name === "SequelizeUniqueConstraintError") {
        res.status(401).send("User already exists");
      } else {
        next(err);
      }
    });
});

router.post("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get("/me", async (req, res) => {
  if (req.user) {
    const user = await User.getContributions(req.user.id);
    res.send(user);
  } else {
    res.sendStatus(401);
  }
});

router.put("/profile", async (req, res, next) => {
  if (!req.user || req.user.id !== req.body.id) res.sendStatus(401);
  else {
    const user = await User.findById(req.user.id).then(user =>
      user.update({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        organization: req.body.organization
      })
    );
    res.send(user);
  }
});

router.use("/google", require("./google"));
