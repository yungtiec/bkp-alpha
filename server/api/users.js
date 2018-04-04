const router = require("express").Router();
const { User, Role, Annotation } = require("../db/models");
const { assignIn } = require("lodash");
module.exports = router;

router.get("/", async (req, res, next) => {
  const requestor = await User.findOne({
    where: { id: req.user.id },
    include: [
      {
        model: Role
      }
    ]
  });
  if (requestor.roles.filter(r => r.name === "admin").length) {
    User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ["id", "email", "first_name", "last_name", "organization"]
    })
      .then(users => res.json(users))
      .catch(next);
  } else {
    res.sendStatus(401);
  }
});

router.get("/profile", async (req, res, next) => {
  try {
    var user = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: Annotation,
          as: "annotations",
          where: {
            hierarchyLevel: 1
          }
        }
      ]
    });
    if (!user) user = await User.findById(req.user.id);
    const replies = await user.getAnnotations({
      where: {
        hierarchyLevel: { $not: 1 }
      },
      include: [
        {
          model: Annotation,
          as: "parent",
          include: [
            {
              model: User,
              as: "owner"
            }
          ]
        }
      ]
    });
    const profile = assignIn({ replies }, user.toJSON());
    res.send(profile);
  } catch (err) {
    next(err);
  }
});
