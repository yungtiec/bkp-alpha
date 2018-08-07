import "./index.scss";
import React, { Component } from "react";
import { withRouter, Route } from "react-router-dom";
import moment from "moment";
import { ProjectBanner } from "./components";
import { ListSurvey } from "../../components";
import Survey from "./scenes/survey";

const ProjectIndex = ({
  surveysById,
  surveyIds,
  metadata,
  match,
  children
}) => {
  return (
    <div className="main-container">
      <Route
        path={`${match.path}/survey/:projectSurveyId`}
        component={Survey}
      />
      {match.isExact && (
        <div className="surveys-container">
          <ProjectBanner metadata={metadata} />
          <span className="surveys-container__sub-header">
            {surveyIds.length
              ? "Browse disclosures"
              : `${metadata.name} currently has no disclosure document`}
          </span>
          <ListSurvey surveyIds={surveyIds} surveysById={surveysById} />
        </div>
      )}
    </div>
  );
};

export default withRouter(ProjectIndex);
