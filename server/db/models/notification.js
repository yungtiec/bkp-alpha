const Sequelize = require("sequelize");
const db = require("../db");
const { assignIn } = require("lodash");

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

Notification.notifyAncestors = function({
  sender,
  engagementItem,
  messageFragment
}) {
  const uri =
    engagementItem.engagementItemType === "annotation"
      ? engagementItem.hierarchyLevel === 1
        ? `${engagementItem.uri}/question/${
            engagementItem.survey_question_id
          }/${engagementItem.engagementItemType}/${engagementItem.id}`
        : `${engagementItem.uri}/question/${
            engagementItem.survey_question_id
          }/${engagementItem.engagementItemType}/${
            engagementItem.ancestors[0].id
          }`
      : `/project/${engagementItem.project_survey.project.symbol}/survey/${
          engagementItem.project_survey.survey.id
        }`;
  var notification = {
    sender_id: sender ? sender.id : null,
    uri,
    message: `${sender.first_name} ${sender.last_name} ${messageFragment}`,
    status: "unread"
  };
  var notificationPromises = engagementItem.ancestors
    .map(a => assignIn({ recipient_id: a.owner_id }, notification))
    .filter(n => n.sender_id !== n.recipient_id)
    .map(n => Notification.create(n));
  engagementItem.owner_id !== sender.id &&
    notificationPromises.concat(
      Notification.create(
        assignIn({ recipient_id: engagementItem.owner_id }, notification)
      )
    );
  return Promise.all(notificationPromises);
};

Notification.notify = function({ sender, engagementItem, messageFragment }) {
  if (sender.id === engagementItem.owner_id) return;
  const uri =
    engagementItem.engagementItemType === "annotation"
      ? engagementItem.hierarchyLevel === 1
        ? `${engagementItem.uri}/question/${
            engagementItem.survey_question_id
          }/${engagementItem.engagementItemType}/${engagementItem.id}`
        : `${engagementItem.uri}/question/${
            engagementItem.survey_question_id
          }/${engagementItem.engagementItemType}/${
            engagementItem.ancestors[0].id
          }`
      : `/project/${engagementItem.project_survey.project.symbol}/survey/${
          engagementItem.project_survey.survey.id
        }/page-comments`;
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
