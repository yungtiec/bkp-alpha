const { User, Role } = require("../db/models");

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

module.exports = {
  ensureAuthentication,
  ensureAdminRole
};
