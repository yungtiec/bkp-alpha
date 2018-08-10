import "./Dashboard.scss";
import React, { Component } from "react";
import {
  DashboardProjectList,
  DashboardSurveyList,
  DashboardRecentIssues
} from "./components";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import policies from "../../policies";

export default ({
  surveysById,
  surveyIds,
  projectSymbolArr,
  projectsBySymbol,
  user
}) => {
  return (
    <div className="main-container d-flex">
      <div className="d-flex flex-column dashboard-sidebar">
        <DashboardSurveyList surveyIds={surveyIds} surveysById={surveysById} />
        <PunditContainer policies={policies} user={user}>
          <PunditTypeSet type="Project">
            <VisibleIf action="ReadManagedProjects" model={{}}>
              <DashboardProjectList
                projectSymbolArr={projectSymbolArr}
                projectsBySymbol={projectsBySymbol}
              />
            </VisibleIf>
          </PunditTypeSet>
        </PunditContainer>
      </div>
      <DashboardRecentIssues />
    </div>
  );
};
