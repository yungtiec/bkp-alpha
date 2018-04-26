import "./index.scss";
import React, { Component } from "react";
import { withRouter, Route } from "react-router-dom";
import { SurveyCard } from "./components";
import { ListView, ProjectSymbolBlueBox } from "../../components";
import Survey from "./scenes/survey";

const ProjectIndex = ({
  projectSurveysById,
  projectSurveyIds,
  metadata,
  match,
  children
}) => {
  const ThisSurveyCard = SurveyCard.bind(SurveyCard, match.url);

  const projectContainerClass = match.isExact
    ? "container main-container"
    : "project-container";

  const surveyContainerClass = match.isExact
    ? "surveys-container"
    : "surveys-container--sub";

  return (
    <div className={projectContainerClass}>
      <Route path={`${match.url}/survey/:projectSurveyId`} component={Survey} />
      {match.isExact && (
        <div className={surveyContainerClass}>
          <div className="project__title d-flex align-content-center">
            <span>{metadata.name}</span>
            <ProjectSymbolBlueBox name={metadata.symbol} />
          </div>
          <p>{metadata.description}</p>
          {!projectSurveyIds.length && (
            <p>{metadata.name} currently has no disclosure document.</p>
          )}
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
};

export default withRouter(ProjectIndex);
