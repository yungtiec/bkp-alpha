const router = require("express").Router();
const notificationController = require("./controller");
const { ensureAuthentication } = require("../utils");
module.exports = router;

/**
 * Getting notifications for user
 *
 * @name Get notifications
 * @authentication
 * @route {GET} /api/notifications
 *
 */
router.get("/", ensureAuthentication, notificationController.getNotifications);

/**
 * Updating notification status in bulk
 *
 * @name Bulk update notifications
 * @authentication
 * @route {PUT} /api/notifications
 * @bodyparam {Array} notificationIds
 * @bodyparam {String} status
 *
 */
router.put(
  "/",
  ensureAuthentication,
  notificationController.bulkPutNotificationStatus
);

/**
 * Updating notification status to read
 *
 * @name Update notification
 * @authentication
 * @route {PUT} /api/notifications/notificationId
 * @routeparam {Number} notificationId
 *
 */
router.put(
  "/:notificationId",
  ensureAuthentication,
  notificationController.putNotificationStatus
);
