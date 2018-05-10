const Sequelize = require("sequelize");
const db = require("../db");
const router = require("express").Router();
const { User, Role, Notification } = require("../db/models");
const { ensureAuthentication } = require("./utils");
module.exports = router;

router.get("/", ensureAuthentication, async (req, res, next) => {
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
});

router.put("/", ensureAuthentication, async (req, res, next) => {
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
});

router.put("/:notificationId", ensureAuthentication, async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    await notification.update({ status: "read" });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
});
