import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { fetchProjectBySymbol } from "./data/actions";
import { getAllProjectSurveys } from "./data/surveys/reducer";
import { getSelectedProject } from "./data/metadata/reducer";
import { SurveyCard } from "./components";
import { ListView } from "../../components";
import Survey from "./scenes/survey";
import autoBind from "react-autobind";

class ProjectIndex extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.fetchProjectBySymbol(this.props.match.params.symbol);
  }

  render() {
    const {
      projectSurveysById,
      projectSurveyIds,
      metadata,
      match,
      children
    } = this.props;

    const ThisSurveyCard = SurveyCard.bind(SurveyCard, match.url);

    return (
      <div className="project-container">
        <Route
          path={`${match.url}/survey/:surveyId`}
          component={Survey}
        />
        {!match.isExact && <div>You might also be interested in</div>}
        <ListView
          viewClassName={"row projects-container"}
          rowClassName={match.isExact ? "col-md-12" : "col-md-4"}
          rowsIdArray={projectSurveyIds}
          rowsById={projectSurveysById}
          renderRow={ThisSurveyCard}
        />
      </div>
    );
  }
}

const mapState = state => {
  const { projectSurveysById, projectSurveyIds } = getAllProjectSurveys(state);
  return {
    projectSurveysById,
    projectSurveyIds,
    metadata: getSelectedProject(state)
  };
};

const actions = {
  fetchProjectBySymbol
};

export default withRouter(connect(mapState, actions)(ProjectIndex));
