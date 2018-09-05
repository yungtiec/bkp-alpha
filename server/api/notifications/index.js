const router = require("express").Router();
const notificationController = require("./controller");
const { ensureAuthentication } = require("../utils");
module.exports = router;

router.get("/", ensureAuthentication, notificationController.getNotifications);

router.put(
  "/",
  ensureAuthentication,
  notificationController.bulkPutNotificationStatus
);

router.put(
  "/:notificationId",
  ensureAuthentication,
  notificationController.putNotificationStatus
);
