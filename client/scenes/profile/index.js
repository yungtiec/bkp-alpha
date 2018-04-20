import React, { Component } from "react";
import { connect } from "react-redux";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { fetchUserProfile } from "./data/actions";
import { getProfile } from "./data/reducer";

const LoadableProfile = Loadable({
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
    let Profile = loaded.default;
    return <Profile {...props} />;
  },
  delay: 1000
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    return <LoadableProfile {...this.props} />;
  }
}

const mapState = state => {
  const { about, pastActions } = getProfile(state);
  return {
    about,
    pastActions
  };
};

const actions = dispatch => {
  return {
    loadInitialData() {
      dispatch(fetchUserProfile());
    }
  };
};

export default connect(mapState, actions)(MyComponent);
