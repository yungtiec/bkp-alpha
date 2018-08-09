const router = require("express").Router();
module.exports = router;

router.use("/users", require("./users"));
router.use("/projects", require("./projects"));
router.use("/surveys", require("./surveys"));
router.use("/project-surveys", require("./project-surveys"));
router.use("/issues", require("./issues"));
router.use("/tags", require("./tags"));
router.use("/notifications", require("./notifications"));
router.use("/feedback", require("./feedback"));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
