import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { fetchUsers, changeAccessStatus } from "./data/actions";
import { getUsers } from "./data/reducer";

const LoadableAdminUserList = Loadable({
  loader: () => import("./UserList"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let AdminUserList = loaded.default;
    return <AdminUserList {...props} />;
  },
  delay: 400
});

class MyComponent extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    return <LoadableAdminUserList {...this.props} />;
  }
}

const mapState = state => {
  const { usersById, userIds } = getUsers(state);
  return {
    usersById,
    userIds
  };
};

const actions = dispatch => {
  return {
    loadInitialData: () => dispatch(fetchUsers()),
    restrictAccess: userId =>
      dispatch(
        changeAccessStatus({
          userId: userId,
          accessStatus: "restricted"
        })
      ),
    restoreAccess: userId =>
      dispatch(
        changeAccessStatus({
          userId: userId,
          accessStatus: "restore"
        })
      )
  };
};

export default connect(mapState, actions)(MyComponent);
