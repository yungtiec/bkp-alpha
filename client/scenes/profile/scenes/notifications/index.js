import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import {
  getAllProjects,
  getProjectSurveys,
  fetchUserNotifications,
  getUserNotifications
} from "../../../../data/reducer";

const LoadableUserNotifications = Loadable({
  loader: () => import("./main"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let UserNotifications = loaded.default;
    return <UserNotifications {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchUserNotifications();
  }

  render() {
    return <LoadableUserNotifications {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { notificationsById, notificationIds } = getUserNotifications(state);
  return {
    notificationsById,
    notificationIds,
    userId: ownProps.match.path.split("/")[2]
  };
};

const actions = {
  fetchUserNotifications
};

export default withRouter(connect(mapState, actions)(MyComponent));
