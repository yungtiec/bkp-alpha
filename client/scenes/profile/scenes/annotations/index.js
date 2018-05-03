import "./index.scss"
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { fetchUserAnnotations } from "./data/actions";
import { getUserAnnotations } from "./data/reducer";

const LoadableUserAnnotations = Loadable({
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
    let UserAnnotations = loaded.default;
    return <UserAnnotations {...props} />;
  },
  delay: 1000
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchUserAnnotations();
  }

  render() {
    return <LoadableUserAnnotations {...this.props} />;
  }
}

const mapState = state => {
  const { annotationsById, annotationIds } = getUserAnnotations(state);
  return {
    annotationsById,
    annotationIds
  };
};

const actions = {
  fetchUserAnnotations
};

export default withRouter(connect(mapState, actions)(MyComponent));
