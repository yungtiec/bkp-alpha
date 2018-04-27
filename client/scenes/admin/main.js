import React, { Component } from "react";
import { withRouter, route, Switch, Route, Redirect } from "react-router-dom";
import history from "../../history";
import ProjectSurvey from "./scenes/ProjectSurvey";
import ProjectSurveyList from "./scenes/ProjectSurveyList";

const Admin = ({ match }) => {
  return (
    <div className="admin-container">
      <Switch>
        <Route
          path={`${match.url}/project-survey/:projectSurveyId`}
          component={ProjectSurvey}
        />
        <Route
          path={`${match.url}/project-surveys`}
          component={ProjectSurveyList}
        />
        <Redirect
          from={`${match.url}`}
          exact
          to={`${match.url}/project-surveys`}
        />
      </Switch>
    </div>
  );
};

export default withRouter(Admin);
