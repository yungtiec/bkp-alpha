import React, { Component } from "react";
import { connect } from "react-redux";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { isEmpty } from "lodash";
import { fetchAllProjects } from "../../data/projects/actions";
import { getAllProjects } from "../../data/projects/reducer";
import {
  fetchLastestSurveysWithStats,
  getSurveyListing
} from "../../data/reducer";
import { batchActions } from "redux-batched-actions";

const LoadableProjects = Loadable({
  loader: () => import("./Projects"),
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
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    if (
      !this.props.projectsBySymbol ||
      !this.props.surveysById ||
      !this.props.surveyIds ||
      !this.props.projectSymbolArr
    )
      return null;
    else return <LoadableProjects {...this.props} />;
  }
}

const mapState = state => {
  const { projectsBySymbol, projectSymbolArr } = getAllProjects(state);
  const { surveysById, surveyIds } = getSurveyListing(state);
  return {
    projectsBySymbol,
    projectSymbolArr,
    surveysById,
    surveyIds
  };
};

const actions = dispatch => {
  return {
    loadInitialData() {
      batchActions([
        dispatch(fetchAllProjects()),
        dispatch(fetchLastestSurveysWithStats())
      ]);
    }
  };
};

export default connect(mapState, actions)(MyComponent);
