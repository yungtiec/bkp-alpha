import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { batchActions } from "redux-batched-actions";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { fetchUserAnnotations } from "./data/actions";
import { getUserAnnotations } from "./data/reducer";
import { fetchAllProjects } from "../../../../data/reducer";
import { getAllProjects, getProjectSurveys } from "../../../../data/reducer";

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
    const userId = this.props.match.path.split("/")[2];
    batchActions([
      this.props.fetchUserAnnotations(userId),
      this.props.fetchAllProjects()
    ]);
  }

  render() {
    return <LoadableUserAnnotations {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { annotationsById, annotationIds } = getUserAnnotations(state);
  const { projectsBySymbol, projectSymbolArr } = getAllProjects(state);
  return {
    annotationsById,
    annotationIds,
    projectsBySymbol,
    projectSymbolArr,
    userId: ownProps.match.path.split("/")[2]
  };
};

const actions = {
  fetchUserAnnotations,
  fetchAllProjects
};

export default withRouter(connect(mapState, actions)(MyComponent));
