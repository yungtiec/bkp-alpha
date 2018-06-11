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
  },
  disclosure_updated: {
    type: Sequelize.BOOLEAN
  }
});

module.exports = Notification;

Notification.notifyRootAndParent = function({
  sender,
  comment,
  parent,
  messageFragment
}) {
  const uri = getContextUri(comment);
  var notification = {
    sender_id: sender ? sender.id : null,
    uri,
    message: `${sender.first_name} ${sender.last_name} ${messageFragment}`,
    status: "unread"
  };
  var notifications = [];
  comment.ancestors.length > 1 &&
    comment.ancestors[0].owner_id !== sender.id &&
    notifications.push(
      assignIn({ recipient_id: comment.ancestors[0].owner_id }, notification)
    );
  parent.owner_id !== sender.id &&
    notifications.push(
      assignIn({ recipient_id: parent.owner_id }, notification)
    );
  return Promise.map(uniqBy(notifications, "recipient_id"), n =>
    Notification.create(n)
  );
};

Notification.notify = function({ sender, comment, messageFragment }) {
  if (sender.id === comment.owner_id || comment.reviewed === "spam") return;
  const uri = getContextUri(comment);
  Notification.create({
    sender_id: sender ? sender.id : null,
    uri,
    message: sender
      ? `${sender.first_name} ${sender.last_name} ${messageFragment}`
      : messageFragment,
    status: "unread",
    recipient_id: comment.owner_id
  });
};

Notification.notifyEngagedUserOnUpdate = function({
  engagedUser,
  projectSurveyId,
  projectSymbol,
  parentSurveyTitle
}) {
  return Notification.create({
    message: `You might be interested in the updated version of ${parentSurveyTitle}`,
    status: "unread",
    recipient_id: engagedUser.id,
    uri: `/project/${projectSymbol}/survey/${projectSurveyId}`,
    disclosure_updated: true
  });
};

Notification.notifyCollaborators = function({
  sender,
  collaboratorId,
  projectSurveyId,
  projectSymbol,
  parentSurveyTitle,
  action
}) {
  return Notification.create({
    message: `${sender.first_name} ${
      sender.last_name
    } ${action} ${parentSurveyTitle} and added you as collaborator`,
    status: "unread",
    recipient_id: collaboratorId,
    uri: `/project/${projectSymbol}/survey/${projectSurveyId}`,
    disclosure_updated: true
  });
};

/**
 *
 * helpers
 *
 */

function getContextUri(comment) {
  var rootItem =
    comment.ancestors && comment.ancestors.length
      ? comment.ancestors[0]
      : comment;
  return rootItem && rootItem.uri
    ? `${rootItem.uri}/question/${comment.survey_question_id}/comment/${
        rootItem.id
      }`
    : `/project/${comment.project_survey.project.symbol}/survey/${
        comment.project_survey.id
      }/comment/${rootItem.id}`;
}
