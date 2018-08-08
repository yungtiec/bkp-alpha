import React, { Component } from "react";
import { connect } from "react-redux";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";

const LoadableAbout = Loadable({
  loader: () => import("./About"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  delay: 400
});

class MyComponent extends React.Component {
  render() {
    return <LoadableAbout {...this.props} />;
  }
}

const mapState = (state, ownProps) => ({ ...ownProps });

const actions = (dispatch, ownProps) => {
  return {
    changeAnonymity: () => dispatch(changeAnonymity()),
    editProfile: props => dispatch(editProfile(props))
  };
};

export default connect(mapState, actions)(MyComponent);
