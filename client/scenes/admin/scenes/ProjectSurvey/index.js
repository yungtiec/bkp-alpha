import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { fetchPendingAnnotations } from "./data/pendingAnnotations/actions";
import { getPendingAnnotations } from "./data/pendingAnnotations/reducer";

const LoadableProjectSurveyAdminView = Loadable({
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
    let ProjectSurveyAdminView = loaded.default;
    return <ProjectSurveyAdminView {...props} />;
  },
  delay: 1000
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchPendingAnnotations(this.props.match.params.projectSurveyId);
  }

  render() {
    return <LoadableProjectSurveyAdminView {...this.props} />;
  }
}

const mapState = state => {
  const { annotationsById, annotationIds } = getPendingAnnotations(state);
  return {
    annotationsById,
    annotationIds
  };
};

const actions = {
  fetchPendingAnnotations
};

export default withRouter(connect(mapState, actions)(MyComponent));
