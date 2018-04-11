import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { fetchProjectBySymbol } from "./data/actions";
import { getAllProjectSurveys } from "./data/surveys/reducer";
import { getSelectedProject } from "./data/metadata/reducer";
import { SurveyCard } from "./components";
import { ListView, ProjectSymbolBlueBox } from "../../components";
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

    const projectContainerClass = match.isExact
      ? "container main-container"
      : "project-container";

    const surveyContainerClass = match.isExact
      ? "surveys-container"
      : "surveys-container--sub";

    return (
      <div className={projectContainerClass}>
        <Route path={`${match.url}/survey/:surveyId`} component={Survey} />
        {match.isExact && (
          <div className={surveyContainerClass}>
            <div className="project__title d-flex align-content-center">
              <span>{metadata.name}</span>
              <ProjectSymbolBlueBox name={metadata.symbol} />
            </div>
            <p>{metadata.description}</p>
            <ListView
              viewClassName={"row projects-container"}
              rowClassName={match.isExact ? "col-md-12" : "col-md-4"}
              rowsIdArray={projectSurveyIds}
              rowsById={projectSurveysById}
              renderRow={ThisSurveyCard}
            />
          </div>
        )}
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
