const router = require("express").Router();
const { User, Role } = require("../db/models");

module.exports = router;

router.post("/login", (req, res, next) => {
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
        req.login(user, err => (err ? next(err) : res.json(user)));
      }
    })
    .catch(next);
});

router.post("/signup", (req, res, next) => {
  User.create(req.body)
    .then(user => {
      req.login(user, err => (err ? next(err) : res.json(user)));
    })
    .catch(err => {
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
  const user = await User.findOne({
    where: { id: req.user.id },
    attributes: [
      "id",
      "first_name",
      "last_name",
      "organization",
      "email",
      "createdAt"
    ],
    include: [
      {
        model: Role,
        attributes: ["name"]
      }
    ]
  });

  res.json(user);
});

router.use("/google", require("./google"));
