const router = require("express").Router();
const db = require("../db");
const {
  Annotation,
  User,
  Role,
  Tag,
  Issue,
  Notification
} = require("../db/models");
const _ = require("lodash");
const {
  ensureAuthentication,
  ensureAdminRole,
  ensureAdminRoleOrAnnotationOwnership,
  ensureResourceAccess
} = require("./utils");
Promise = require("bluebird");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const annotations = await Annotation.scope({
      method: [
        "flatThreadByRootId",
        { where: { uri: req.query.uri, hierarchyLevel: 1 } }
      ]
    }).findAll();
    res.send(annotations);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/reply",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
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
      var [ancestors, reply, user] = await Promise.all([
        parent
          .getAncestors({
            include: [
              {
                model: db.model("user"),
                as: "owner",
                required: false
              }
            ]
          })
          .then(ancestors =>
            _.orderBy(ancestors, ["hierarchyLevel"], ["asc"]).concat(parent)
          ),
        Annotation.create(child),
        User.findById(req.user.id)
      ]);
      var rootAncestor = ancestors[0];
      reply = await reply.setParent(parent.toJSON().id);
      reply = await reply.setOwner(req.user.id);
      ancestry = await Annotation.scope({
        method: [
          "flatThreadByRootId",
          { where: { id: rootAncestor ? rootAncestor.id : parent.id } }
        ]
      }).findOne();
      await Notification.notifyAncestors({
        sender: user,
        engagementItem: _.assignIn(reply.toJSON(), { ancestors }),
        messageFragment: "replied to your post"
      });
      res.send(ancestry);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/upvote",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!req.body.hasUpvoted) {
        await user.addUpvotedAnnotation(req.body.annotationId);
      } else {
        await user.removeUpvotedAnnotation(req.body.annotationId);
      }
      const annotation = await Annotation.scope({
        method: ["upvotes", req.body.annotationId]
      }).findOne();
      if (!req.body.hasUpvoted) {
        await Notification.notify({
          sender: user,
          engagementItem: annotation,
          messageFragment: "liked your post"
        });
      }
      res.send({
        upvotesFrom: annotation.upvotesFrom,
        annotationId: annotation.id
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/edit",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
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
            attributes: ["name", "id"],
            required: false
          },
          {
            model: db.model("issue"),
            required: false
          }
        ]
      });
      var prevTags = annotation.tags || [];
      var removedTags = prevTags.filter(function(prevTag) {
        return req.body.tags.map(tag => tag.name).indexOf(prevTag.name) === -1;
      });
      var addedTags = req.body.tags
        ? req.body.tags.filter(tag => {
            return (
              prevTags.map(prevTag => prevTag.name).indexOf(tag.name) === -1
            );
          })
        : [];
      var removedTagPromises, addedTagPromises, issuePromise;
      if (annotation.owner.email !== req.user.email) res.sendStatus(401);
      else {
        await annotation.update({ comment: req.body.comment });
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
        issuePromise =
          "issueOpen" in req.body &&
          (req.body.issueOpen || (!req.body.issueOpen && annotation.issue))
            ? Issue.findOrCreate({
                defaults: {
                  open: req.body.issueOpen
                },
                where: { annotation_id: annotation.id }
              }).spread((issue, created) => {
                if (!created) issue.update({ open: req.body.issueOpen });
              })
            : null;
        await Promise.all([removedTagPromises, addedTagPromises, issuePromise]);
        const ancestors = await annotation.getAncestors({
          raw: true
        });
        const rootAncestor = _.orderBy(
          ancestors,
          ["hierarchyLevel"],
          ["asc"]
        )[0];
        const ancestry = await Annotation.scope({
          method: [
            "flatThreadByRootId",
            { where: { id: rootAncestor ? rootAncestor.id : annotation.id } }
          ]
        }).findOne();
        res.send(ancestry);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/tag/remove",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      const annotation = await Annotation.findById(
        Number(req.body.annotationId)
      );
      await annotation.removeTag(req.body.tagId);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/tag/add",
  ensureAuthentication,
  ensureResourceAccess,
  async (req, res, next) => {
    try {
      const annotation = await Annotation.findById(
        Number(req.body.annotationId)
      );
      const [tag, created] = await Tag.findOrCreate({
        where: { name: req.body.tagName },
        default: { name: req.body.tagName }
      });
      await annotation.addTag(tag.id);
      res.send(tag);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/pending/:projectSurveyId", async (req, res, next) => {
  try {
    var annotations = await Annotation.findAll({
      where: {
        reviewed: "pending",
        project_survey_id: req.params.projectSurveyId
      },
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
