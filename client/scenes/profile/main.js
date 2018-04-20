import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, route, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { fetchUserProfile } from "./data/actions";
import { getProfile } from "./data/reducer";
import {
  ProfileBanner,
  ProfileNavbar,
  About,
  ProfileAnnotations,
  ProfileReplies
} from "./components";
import autoBind from "react-autobind";
import moment from "moment";
import history from "../../history";

const Profile = ({ about, pastActions, match }) => {
  const activeTab = window.location.pathname.split("/")[2];

  return (
    <div className="profile-container">
      <ProfileBanner
        name={`${about.first_name} ${about.last_name}`}
        numAnnotations={
          pastActions.annotations && pastActions.annotations.length
        }
        joinDate={moment(about.createdAt).format("MMM YYYY")}
      />
      <ProfileNavbar activeTab={activeTab} url={match.url} />
      <Switch>
        <Route
          path={`${match.url}/about`}
          render={props => <About {...about} {...props} />}
        />
        <Route
          path={`${match.url}/annotations`}
          render={props => (
            <ProfileAnnotations
              annotations={pastActions.annotations}
              {...props}
            />
          )}
        />
        <Route
          path={`${match.url}/replies`}
          render={props => (
            <ProfileReplies
              about={about}
              replies={pastActions.replies}
              {...props}
            />
          )}
        />
        <Redirect from="/" exact to="/about" />
      </Switch>
    </div>
  );
};

const mapState = (state, ownProps) => {
  const { about, pastActions } = ownProps;
  return {
    about,
    pastActions
  };
};

export default withRouter(Profile);
