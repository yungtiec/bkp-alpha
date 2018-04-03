const router = require("express").Router();
const db = require("../db");
const { Annotation, User, Role } = require("../db/models");
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
        "comment"
      ]),
      { comment: req.body.comment }
    );
    const ancestors = await parent.getAncestors({ raw: true });
    var rootAncestor = _.orderBy(ancestors, ["hierarchyLevel"], ["asc"])[0];
    var reply = await Annotation.create(child);
    reply = await reply.setParent(parent.toJSON().id);
    ancestry = await Annotation.findOneThreadByRootId(
      rootAncestor ? rootAncestor.id : parent.id
    );
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
      else await user.removeUpvoted(req.body.annotationId);
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
      const ancestry = await Annotation.findOneThreadByRootId(
        rootAncestor ? rootAncestor.id : annotation.id
      );
      res.send(ancestry);
    } catch (err) {
      next(err);
    }
  }
});

router.post("/edit", async (req, res, next) => {
  if (!req.user) res.sendStatus(401);
  else {
    try {
      var annotation = await Annotation.findOne({
        where: { id: req.body.annotationId },
        include: [
          {
            model: User,
            as: "owner",
            attributes: ["first_name", "last_name", "email"]
          }
        ]
      });
      if (annotation.owner.email !== req.user.email) res.sendStatus(401);
      else {
        annotation = await annotation.update({ comment: req.body.comment });
        const ancestors = await annotation.getAncestors({
          raw: true
        });
        const rootAncestor = _.orderBy(
          ancestors,
          ["hierarchyLevel"],
          ["asc"]
        )[0];
        const ancestry = await Annotation.findOneThreadByRootId(
          rootAncestor ? rootAncestor.id : annotation.id
        );
        res.send(ancestry);
      }
    } catch (err) {
      next(err);
    }
  }
});

router.get("/pending", async (req, res, next) => {
  try {
    const requestor = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: Role
        }
      ]
    });
    if (requestor.roles.filter(r => r.name === "admin").length) {
      var annotations = await Annotation.findAll({
        where: { reviewed: "pending" },
        include: [
          {
            model: User,
            as: "owner"
          },
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
      res.send(annotations);
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    next(err);
  }
});

router.post("/verified", async (req, res, next) => {});
