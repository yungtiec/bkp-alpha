import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { batchActions } from "redux-batched-actions";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { fetchUserProjectSurveyComments } from "./data/actions";
import { getUserProjectSurveyComments } from "./data/reducer";
import {
  fetchAllProjects,
  fetchPublishedProjectSurveyStats
} from "../../../../data/reducer";
import { getAllProjects, getProjectSurveys } from "../../../../data/reducer";

const LoadableUserProjectSurveyComments = Loadable({
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
    let UserProjectSurveyComments = loaded.default;
    return <UserProjectSurveyComments {...props} />;
  },
  delay: 1000
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    batchActions([
      this.props.fetchUserProjectSurveyComments(),
      this.props.fetchAllProjects(),
      this.props.fetchPublishedProjectSurveyStats()
    ]);
  }

  render() {
    return <LoadableUserProjectSurveyComments {...this.props} />;
  }
}

const mapState = state => {
  const { projectSurveyCommentsById, projectSurveyCommentIds } = getUserProjectSurveyComments(state);
  const { projectsBySymbol, projectSymbolArr } = getAllProjects(state);
  const { projectSurveysById, projectSurveyIds } = getProjectSurveys(state);
  return {
    projectSurveyCommentsById,
    projectSurveyCommentIds,
    projectsBySymbol,
    projectSymbolArr,
    projectSurveysById,
    projectSurveyIds
  };
};

const actions = {
  fetchUserProjectSurveyComments,
  fetchAllProjects,
  fetchPublishedProjectSurveyStats
};

export default withRouter(connect(mapState, actions)(MyComponent));
