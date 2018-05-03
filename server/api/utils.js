const { User, Role, Annotation } = require("../db/models");

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
  const requestor = await User.scope({
    method: ["roles", Number(req.params.userId)]
  }).findOne();
  if (
    !requestor.roles.filter(r => r.name === "admin").length ||
    Number(req.params.userId) !== req.user.id
  ) {
    res.sendStatus(401);
  } else {
    next();
  }
};

const ensureAdminRoleOrAnnotationOwnership = async (req, res, next) => {
  const requestor = await User.findOne({
    where: { id: req.user.id },
    include: [
      {
        model: Role
      }
    ]
  });
  const annotation = await Annotation.findById(req.body.annotationId);
  if (
    requestor.roles.filter(r => r.name === "admin").length ||
    annotation.owner_id === req.user.id
  ) {
    next();
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  ensureAuthentication,
  ensureAdminRole,
  ensureAdminRoleOrAnnotationOwnership,
  ensureAdminRoleOrOwnership
};
