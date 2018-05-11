const {
  User,
  Role,
  Annotation,
  ProjectSurveyComment
} = require("../db/models");

const ensureAuthentication = async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

const ensureAdminRole = async (req, res, next) => {
  const requestor = await User.findOne({
    where: { id: req.user.id },
    include: [
      {
        model: Role
      }
    ]
  });
  if (requestor.roles.filter(r => r.name === "admin").length) {
    next();
  } else {
    res.sendStatus(401);
  }
};

const ensureAdminRoleOrOwnership = async (req, res, next) => {
  try {
    const requestor = await User.scope({
      method: ["roles", Number(req.user.id)]
    }).findOne();
    if (
      requestor.roles.filter(r => r.name === "admin").length ||
      Number(req.params.userId) === req.user.id
    ) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    next(err);
  }
};

const ensureAdminRoleOrEngagementItemOwnership = async (req, res, next) => {
  try {
    const requestor = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: Role
        }
      ]
    });
    const engagementItem =
      req.body.engagementItem.engagementItemType === "annotation"
        ? await Annotation.findById(req.body.engagementItem.id)
        : await ProjectSurveyComment.findById(req.body.engagementItem.id);
    if (
      requestor.roles.filter(r => r.name === "admin").length ||
      engagementItem.owner_id === req.user.id
    ) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    next(err);
  }
};

const ensureResourceAccess = async (req, res, next) => {
  const requestor = await User.findById(req.user.id);
  if (requestor.restricted_access) res.sendStatus(403);
  else next();
};

module.exports = {
  ensureAuthentication,
  ensureAdminRole,
  ensureAdminRoleOrEngagementItemOwnership,
  ensureAdminRoleOrOwnership,
  ensureResourceAccess
};
