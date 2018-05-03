import React, { Component } from "react";
import { withRouter, route, Switch, Route, Redirect } from "react-router-dom";
import history from "../../history";
import ProjectSurvey from "./scenes/ProjectSurvey";
import Lists from "./scenes/Lists";

const Admin = ({ match }) => {
  return (
    <div className="admin-container">
      <Switch>
        <Route
          path={`${match.url}/project-survey/:projectSurveyId`}
          component={ProjectSurvey}
        />
        <Route
          path={`${match.url}/list`}
          component={Lists}
        />
        <Redirect
          from={`${match.url}`}
          exact
          to={`${match.url}/list`}
        />
      </Switch>
    </div>
  );
};

export default withRouter(Admin);
