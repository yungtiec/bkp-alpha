const router = require("express").Router();
module.exports = router;

router.use("/users", require("./users"));
router.use("/annotator", require("./annotator"));
router.use("/annotation", require("./annotation"));
router.use("/tag", require("./tag"));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
