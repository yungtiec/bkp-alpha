import "./index.scss";
import React, { Component } from "react";
import { withRouter, Route } from "react-router-dom";
import { ProjectBanner } from "./components";
import { ListView, ProjectSymbolBlueBox, CardSurvey } from "../../components";
import Survey from "./scenes/survey";

const ProjectIndex = ({
  projectSurveysById,
  projectSurveyIds,
  metadata,
  match,
  children
}) => {
  return (
    <div className="main-container">
      <Route path={`${match.path}/survey/:projectSurveyId`} component={Survey} />
      {match.isExact && (
        <div className="surveys-container">
          <ProjectBanner metadata={metadata} />
          <span className="surveys-container__sub-header">
            {projectSurveyIds.length
              ? "Browse disclosures"
              : `${metadata.name} currently has no disclosure document`}
          </span>
          {projectSurveyIds.length ? (
            <ListView
              viewClassName={"row entity-cards"}
              rowClassName="col-md-12 entity-card__container"
              rowsIdArray={projectSurveyIds}
              rowsById={projectSurveysById}
              renderRow={CardSurvey}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default withRouter(ProjectIndex);
