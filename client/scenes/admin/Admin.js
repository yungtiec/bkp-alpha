import React, { Component } from "react";
import { withRouter, route, Switch, Route, Redirect } from "react-router-dom";
import history from "../../history";
import { requiresAuthorization } from "../../components";
import Version from "./scenes/Version";
import AdminListContainer from "./scenes/Lists/AdminListContainer";

const Admin = ({ match }) => {
  return (
    <div className="admin-container">
      <Switch>
        <Route
          path={`${match.url}/project-document/:versionId`}
          component={Version}
        />
        <Route path={`${match.url}/list`} component={AdminListContainer} />
        <Redirect from={`${match.url}`} exact to={`${match.url}/list`} />
      </Switch>
    </div>
  );
};

export default withRouter(
  requiresAuthorization({
    Component: Admin,
    roleRequired: ["admin"]
  })
);
