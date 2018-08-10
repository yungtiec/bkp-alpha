import React, { Component } from "react";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import moment from "moment";
import { ProjectBanner } from "./components";
import { ListSurvey } from "../../components";

const ProjectIndex = props => {
  const { surveysById, surveyIds, metadata } = props;
  return (
    <div className="main-container">
      <div className="surveys-container">
        <ProjectBanner metadata={metadata} />
        <span className="surveys-container__sub-header">
          {surveyIds.length
            ? "Browse disclosures"
            : `${metadata.name} currently has no disclosure document`}
        </span>
        <ListSurvey surveyIds={surveyIds} surveysById={surveysById} />
      </div>
    </div>
  );
};

export default withRouter(ProjectIndex);
