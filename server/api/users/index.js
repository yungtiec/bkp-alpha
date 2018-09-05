const router = require("express").Router();
const userController = require("./controller");
const { ensureAuthentication } = require("../utils");
module.exports = router;

const ensureCorrectRole = (req, res, next) => {
  if (!req.user.roles || !req.user.roles.length) {
    console.log(req.user.roles);
    res.send([]);
    return;
  } else {
    next();
  }
};

router.get("/", ensureAuthentication, userController.getUsers);

router.get(
  "/:userId",
  ensureAuthentication,
  // nothing senstiive here, we can let users decide what to diclose in their profile later on
  userController.getUser
);

router.get(
  "/:userId/projects",
  ensureAuthentication,
  ensureCorrectRole,
  userController.getUserProjects
);

router.get(
  "/:userId/documents",
  ensureAuthentication,
  ensureCorrectRole,
  userController.getUserDocuments
);

router.get(
  "/:userId/comments",
  ensureAuthentication,
  // nothing senstiive here, we can let users decide what to diclose in their profile later on
  userController.getUserComments
);
