import React from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import { Drafts } from "./scenes";

export default ({ match }) => (
  <Switch>
    <Route path={`${match.url}/drafts`} component={Drafts} />
    <Redirect from="/" exact to="/drafts" />
  </Switch>
);
