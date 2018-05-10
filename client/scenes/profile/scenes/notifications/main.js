import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import history from "../../../../history";
import { NotificationItem } from "./components";
import {
  updateNotificationStatus,
  updateAllNotificationStatus
} from "../../../../data/reducer";

class ProfileNotifications extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleNotificationOnClick(notification) {
    this.props.updateNotificationStatus(notification, "read");
    if (notification.uri)
      history.push(notification.uri.replace(window.origin, ""));
  }

  markAllAsRead() {
    this.props.updateAllNotificationStatus("read");
  }

  render() {
    const { notificationsById, notificationIds } = this.props;

    return (
      <div className="main-container">
        <div className="notification-items__container">
          {!notificationIds || !(notificationIds && notificationIds.length) ? (
            <p className="text-center mt-5">No New Notification</p>
          ) : null}
          {notificationIds && notificationIds.length ? (
            <div className="text-right">
              <button
                onClick={this.markAllAsRead}
                className="btn btn-outline-primary"
              >
                Mark all as read
              </button>
            </div>
          ) : null}
          {notificationIds.map(nid => (
            <NotificationItem
              key={`notification-item__${nid}`}
              handleClick={() =>
                this.handleNotificationOnClick(notificationsById[nid])
              }
              message={notificationsById[nid].message}
              createdAt={notificationsById[nid].createdAt}
              sender={notificationsById[nid].sender}
              status={notificationsById[nid].status}
            />
          ))}
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  return {
    ...ownProps
  };
};

const actions = { updateNotificationStatus, updateAllNotificationStatus };

export default connect(mapState, actions)(ProfileNotifications);
