const Sequelize = require("sequelize");
const { User, Role, Notification } = require("../../db/models");

const getNotifications = async (req, res, next) => {
  try {
    const { notifications } = await User.scope({
      method: ["notifications", req.user.id]
    }).findOne();
    // eagerly update status
    // but still want users to view them as unread
    Promise.map(notifications, n =>
      n.update({
        status: "seen"
      })
    );
    res.send(notifications);
  } catch (err) {
    console.log(err);
  }
};

const bulkPutNotificationStatus = async (req, res, next) => {
  try {
    await Promise.map(req.body.notificationIds, nid =>
      Notification.findById(nid).then(notification =>
        notification.update({ status: req.body.status })
      )
    );
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

const putNotificationStatus = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    await notification.update({ status: "read" });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getNotifications,
  bulkPutNotificationStatus,
  putNotificationStatus
};
