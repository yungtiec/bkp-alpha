import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { fetchUserBasicInfo } from "./scenes/about/data/actions";
import { getUserBasicInfo } from "./scenes/about/data/reducer";

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
  delay: 400
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
  const basicInfo = getUserBasicInfo(state);
  return {
    basicInfo
  };
};

const actions = (dispatch, props) => {
  return {
    loadInitialData() {
      dispatch(fetchUserBasicInfo(props.match.params.userId));
    }
  };
};

export default withRouter(connect(mapState, actions)(MyComponent));
