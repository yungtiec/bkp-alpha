import React from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import { Drafts } from "./scenes";
import { MyDocumentsNavbar } from "./components";

export default ({ match }) => {
  const activeTab = window.location.pathname.split("/")[3];
  return (
    <div className="main-container">
      <MyDocumentsNavbar activeTab={activeTab} url={match.url} />
      <Switch>
        <Route path={`${match.url}/drafts`} component={Drafts} />
        <Redirect from="/" exact to="/drafts" />
      </Switch>
    </div>
  );
};
