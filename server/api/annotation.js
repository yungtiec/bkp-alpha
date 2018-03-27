const router = require("express").Router();
const db = require("../db");
const { Annotation, User } = require("../db/models");
const _ = require("lodash");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const annotations = await Annotation.getAnnotationsFromUrl(req.query.uri);
    res.send(annotations);
  } catch (err) {
    next(err);
  }
});

router.post("/reply", async (req, res, next) => {
  try {
    var ancestry;
    const parent = await Annotation.findById(Number(req.body.parentId));
    const child = _.assignIn(
      _.omit(parent.toJSON(), [
        "id",
        "createdAt",
        "updatedAt",
        "hierarchyLevel",
        "parentId",
        "text"
      ]),
      { text: req.body.comment }
    );
    const ancestors = await parent.getAncestors({ raw: true });
    var rootAncestor = _.orderBy(ancestors, ["hierarchyLevel"], ["asc"])[0];
    var reply = await Annotation.create(child);
    reply = await reply.setParent(parent.toJSON().id);
    ancestry = await Annotation.findOne({
      where: { id: rootAncestor ? rootAncestor.id : parent.id },
      include: [
        {
          model: db.model("user"),
          as: "upvotesFrom",
          attributes: ["first_name", "last_name", "email"]
        },
        {
          model: Annotation,
          include: {
            model: db.model("user"),
            as: "upvotesFrom",
            attributes: ["first_name", "last_name", "email"]
          },
          as: "descendents",
          hierarchy: true
        }
      ]
    });
    res.send(ancestry);
  } catch (err) {
    next(err);
  }
});

router.post("/upvote", async (req, res, next) => {
  if (!req.user) res.sendStatus(401);
  else {
    try {
      const user = await User.findById(req.user.id);
      if (!req.body.hasUpvoted) await user.addUpvoted(req.body.annotationId);
      else await user.removeUpvoted(req.body.annotationId)
      const annotation = await Annotation.findOne({
        where: { id: req.body.annotationId },
        include: [
          {
            model: User,
            as: "upvotesFrom",
            attributes: ["first_name", "last_name", "email"]
          }
        ]
      });
      const ancestors = await annotation.getAncestors({
        raw: true
      });
      const rootAncestor = _.orderBy(ancestors, ["hierarchyLevel"], ["asc"])[0];
      const ancestry = await Annotation.findOne({
        where: { id: rootAncestor ? rootAncestor.id : annotation.id },
        include: [
          {
            model: db.model("user"),
            as: "upvotesFrom",
            attributes: ["first_name", "last_name", "email"]
          },
          {
            model: Annotation,
            include: {
              model: db.model("user"),
              as: "upvotesFrom",
              attributes: ["first_name", "last_name", "email"]
            },
            as: "descendents",
            hierarchy: true
          }
        ]
      });
      res.send(ancestry);
    } catch (err) {
      next(err);
    }
  }
});
