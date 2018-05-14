import "./index.scss";
import React, { Component } from "react";
import { withRouter, Route } from "react-router-dom";
import { SurveyCard, ProjectBanner } from "./components";
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

  return (
    <div className="main-container">
      <Route path={`${match.url}/survey/:projectSurveyId`} component={Survey} />
      {match.isExact && (
        <div className="surveys-container">
          <ProjectBanner metadata={metadata} />
          <span className="surveys-container__sub-header">
            {projectSurveyIds.length
              ? "Browse Surveys"
              : `${metadata.name} currently has no disclosure document`}
          </span>
          {projectSurveyIds.length ? (
            <ListView
              viewClassName={"row entity-cards"}
              rowClassName="col-md-12 entity-card__container"
              rowsIdArray={projectSurveyIds}
              rowsById={projectSurveysById}
              renderRow={ThisSurveyCard}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default withRouter(ProjectIndex);
