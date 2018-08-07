import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { fetchAllProjects } from "../../data/projects/actions";
import { getAllProjects } from "../../data/projects/reducer";
import {
  fetchLastestSurveysWithStats,
  getSurveyListing
} from "../../data/reducer";
import { ListProject, ListSurvey } from "../../components";
import autoBind from "react-autobind";
import { batchActions } from "redux-batched-actions";

class ProjectList extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const {
      projectsBySymbol,
      projectSymbolArr,
      surveysById,
      surveyIds
    } = this.props;

    return (
      <div className="main-container">
        <span className="projects-container__sub-header">Recent Documents</span>
        <ListSurvey surveyIds={surveyIds} surveysById={surveysById} />
        {projectSymbolArr && projectSymbolArr.length ? (
          <span className="projects-container__sub-header">Categories</span>
        ) : null}
        <ListProject
          projectSymbolArr={projectSymbolArr}
          projectsBySymbol={projectsBySymbol}
        />
      </div>
    );
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

export default connect(mapState, actions)(ProjectList);
