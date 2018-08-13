import "./AdminListContainer.scss";
import React, { Component } from "react";
import { withRouter, route, Switch, Route, Redirect } from "react-router-dom";
import history from "../../../../history";
import QueryAdminSurveyList from "./scenes/SurveyList/QueryAdminSurveyList";
import QueryUserList from "./scenes/UserList/QueryUserList";
import { AdminListSidebar } from "./components";

const AdminListContainer = ({ match }) => {
  return (
    <div className="admin-list">
      <AdminListSidebar />
      <Switch>
        <Route
          path={`${match.url}/project-surveys`}
          component={QueryAdminSurveyList}
        />
        <Route path={`${match.url}/users`} component={QueryUserList} />
        <Redirect
          from={`${match.url}`}
          exact
          to={`${match.url}/project-surveys`}
        />
      </Switch>
    </div>
  );
};

export default withRouter(AdminListContainer);
