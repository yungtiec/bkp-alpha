const Sequelize = require("sequelize");
const db = require("../db");
const { assignIn, uniqBy } = require("lodash");

const Notification = db.define("notification", {
  recipient_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  sender_id: {
    type: Sequelize.INTEGER
  },
  uri: {
    type: Sequelize.TEXT
  },
  message: {
    type: Sequelize.TEXT
  },
  status: {
    type: Sequelize.ENUM,
    values: ["seen", "read", "unread"]
  },
  read_date: {
    type: Sequelize.DATE
  }
});

module.exports = Notification;

Notification.notifyRootAndParent = function({
  sender,
  engagementItem,
  parent,
  messageFragment
}) {
  const uri = getContextUri(engagementItem);
  var notification = {
    sender_id: sender ? sender.id : null,
    uri,
    message: `${sender.first_name} ${sender.last_name} ${messageFragment}`,
    status: "unread"
  };
  var notifications = [];
  engagementItem.ancestors.length > 1 &&
    engagementItem.ancestors[0].owner_id !== sender.id &&
    notifications.push(
      assignIn(
        { recipient_id: engagementItem.ancestors[0].owner_id },
        notification
      )
    );
  parent.owner_id !== sender.id &&
    notifications.push(
      assignIn({ recipient_id: parent.owner_id }, notification)
    );
  return Promise.map(uniqBy(notifications, "recipient_id"), n =>
    Notification.create(n)
  );
};

Notification.notify = function({ sender, engagementItem, messageFragment }) {
  if (sender.id === engagementItem.owner_id) return;
  const uri = getContextUri(engagementItem);
  Notification.create({
    sender_id: sender ? sender.id : null,
    uri,
    message: sender
      ? `${sender.first_name} ${sender.last_name} ${messageFragment}`
      : messageFragment,
    status: "unread",
    recipient_id: engagementItem.owner_id
  });
};

/**
 *
 * helpers
 *
 */

function getContextUri(engagementItem) {
  return engagementItem.engagementItemType === "annotation"
    ? engagementItem.hierarchyLevel === 1
      ? `${engagementItem.uri}/question/${engagementItem.survey_question_id}/${
          engagementItem.engagementItemType
        }/${engagementItem.id}`
      : `${engagementItem.uri}/question/${engagementItem.survey_question_id}/${
          engagementItem.engagementItemType
        }/${engagementItem.ancestors[0].id}`
    : engagementItem.hierarchyLevel === 1
      ? `/project/${engagementItem.project_survey.project.symbol}/survey/${
          engagementItem.project_survey.survey.id
        }/page-comments/${engagementItem.id}`
      : `/project/${engagementItem.project_survey.project.symbol}/survey/${
          engagementItem.project_survey.survey.id
        }/page-comments/${engagementItem.ancestors[0].id}`;
}
