import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import {
  fetchManagedProjects,
  fetchOwnProjectSurveys,
  getManagedProjects,
  getOwnProjectSurveys
} from "../../data/reducer";
import { batchActions } from "redux-batched-actions";
import { omit } from "lodash";

const LoadableDashboard = Loadable({
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
    let Project = loaded.default;
    return <Project {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    batchActions([
      this.props.fetchManagedProjects(),
      this.props.fetchOwnProjectSurveys()
    ]);
  }

  render() {
    if (!this.props.projectSurveyIds || !this.props.projectSymbolArr)
      return null;
    return <LoadableDashboard {...this.props} />;
  }
}

const mapState = state => {
  const { projectSymbolArr, projectsBySymbol } = getManagedProjects(state);
  const { projectSurveysById, projectSurveyIds } = getOwnProjectSurveys(state);
  return {
    projectSurveysById,
    projectSurveyIds,
    projectSymbolArr,
    projectsBySymbol,
    user: omit(state.data.user, [
      "projectSurveysById",
      "projectSurveyIds",
      "projectSymbolArr",
      "projectsBySymbol"
    ])
  };
};

const actions = {
  fetchManagedProjects,
  fetchOwnProjectSurveys
};

export default connect(mapState, actions)(MyComponent);
