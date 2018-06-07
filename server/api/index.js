const router = require("express").Router();
module.exports = router;

router.use("/admin", require("./admin"));
router.use("/users", require("./users"));
router.use("/annotator", require("./annotator"));
router.use("/comment", require("./comment"));
router.use("/project", require("./project"));
router.use("/tag", require("./tag"));
router.use("/notifications", require("./notifications"));
router.use("/upload", require("./upload"));


router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
