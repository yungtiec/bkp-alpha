const router = require("express").Router();
const db = require("../db");
const { Annotation, User, Role, Tag, Issue } = require("../db/models");
const _ = require("lodash");
const { ensureAuthentication, ensureAdminRole } = require("./utils");
Promise = require("bluebird");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const annotations = await Annotation.getAnnotationsFromUrl(req.query.uri);
    res.send(annotations);
  } catch (err) {
    next(err);
  }
});

router.post("/reply", ensureAuthentication, async (req, res, next) => {
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
        "comment",
        "reviewed",
        "owner"
      ]),
      { comment: req.body.comment, reviewed: "pending" }
    );
    const ancestors = await parent.getAncestors({ raw: true });
    var rootAncestor = _.orderBy(ancestors, ["hierarchyLevel"], ["asc"])[0];
    var reply = await Annotation.create(child);
    reply = await reply.setParent(parent.toJSON().id);
    reply = reply.setOwner(req.user.id);
    ancestry = await Annotation.findOneThreadByRootId(
      rootAncestor ? rootAncestor.id : parent.id
    );
    res.send(ancestry);
  } catch (err) {
    next(err);
  }
});

router.post("/upvote", ensureAuthentication, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!req.body.hasUpvoted)
      await user.addUpvotedAnnotation(req.body.annotationId);
    else await user.removeUpvotedAnnotation(req.body.annotationId);
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
    res.send({
      upvotesFrom: annotation.upvotesFrom,
      annotationId: annotation.id
    });
  } catch (err) {
    next(err);
  }
});

router.post("/edit", ensureAuthentication, async (req, res, next) => {
  try {
    var annotation = await Annotation.findOne({
      where: { id: req.body.annotationId },
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["first_name", "last_name", "email"]
        },
        {
          model: db.model("tag"),
          attributes: ["name", "id"]
        }
      ]
    });
    var prevTags = annotation.tags;
    var removedTags = prevTags.filter(function(prevTag) {
      return req.body.tags.map(tag => tag.name).indexOf(prevTag.name) === -1;
    });
    var addedTags = req.body.tags.filter(tag => {
      return prevTags.map(prevTag => prevTag.name).indexOf(tag.name) === -1;
    });
    var removedTagPromises, addedTagPromises;
    if (annotation.owner.email !== req.user.email) res.sendStatus(401);
    else {
      annotation = await annotation.update({ comment: req.body.comment });
      removedTagPromises = Promise.map(removedTags, tag =>
        annotation.removeTag(tag.id)
      );
      addedTagPromises = Promise.map(addedTags, async addedTag => {
        const [tag, created] = await Tag.findOrCreate({
          where: { name: addedTag.name },
          default: { name: addedTag.name }
        });
        return annotation.addTag(tag.id);
      });
      await Promise.all([removedTagPromises, addedTagPromises]);
      const ancestors = await annotation.getAncestors({
        raw: true
      });
      const rootAncestor = _.orderBy(ancestors, ["hierarchyLevel"], ["asc"])[0];
      const ancestry = await Annotation.findOneThreadByRootId(
        rootAncestor ? rootAncestor.id : annotation.id
      );
      res.send(ancestry);
    }
  } catch (err) {
    next(err);
  }
});

router.put("/tag/remove", async (req, res, next) => {
  try {
    const annotation = await Annotation.findById(Number(req.body.annotationId));
    await annotation.removeTag(req.body.tagId);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.put("/tag/add", async (req, res, next) => {
  try {
    const annotation = await Annotation.findById(Number(req.body.annotationId));
    const [tag, created] = await Tag.findOrCreate({
      where: { name: req.body.tagName },
      default: { name: req.body.tagName }
    });
    await annotation.addTag(tag.id);
    res.send(tag);
  } catch (err) {
    next(err);
  }
});

router.get("/pending", async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
});

router.post(
  "/verify",
  ensureAuthentication,
  ensureAdminRole,
  async (req, res, next) => {
    try {
      var annotation = await Annotation.findById(req.body.annotationId);
      annotation.update({ reviewed: req.body.reviewed });
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/issue",
  ensureAuthentication,
  ensureAdminRole,
  async (req, res, next) => {
    try {
      var annotation = await Annotation.findOne({
        where: { id: req.body.annotationId },
        include: [
          {
            model: Issue
          }
        ]
      });
      annotation.issue
        ? await Issue.update(
            {
              open: req.body.open
            },
            {
              where: { id: annotation.issue.id }
            }
          )
        : await Issue.create({
            open: req.body.open,
            annotation_id: req.body.annotationId
          });
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);
