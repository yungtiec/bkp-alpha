import "./Navbar.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import {
  logout,
  getUserNotificationCount,
  currentUserIsAdmin,
  fetchUserNotifications
} from "../data/reducer";
import { AuthWidget, SearchBar } from "./index";
import asyncPoll from "react-async-poll";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import policies from "../policies.js";

const onPollInterval = (props, dispatch) => {
  if (!props.isLoggedIn) return;
  return props.fetchUserNotifications();
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { isAdmin, isLoggedIn, width, user, numNotifications } = this.props;

    return (
      <div className="header">
        <nav className="navbar navbar-expand-md no-gutters navbar--logo">
          <div className="box--left">
            <div className="logo-header">
              <img
                width="100px"
                height="auto"
                className="logo__large"
                src="/assets/the-brooklyn-project-logo.png"
              />
            </div>
          </div>
          <div className="box--right">
            {width > 600 && isAdmin ? (
              <Link to="/admin" className="navbar__nav-item">
                admin
              </Link>
            ) : (
              ""
            )}
            {width > 600 ? (
              <Link to="/projects" className="navbar__nav-item">
                projects
              </Link>
            ) : (
              ""
            )}
            {width > 600 ? (
              <PunditContainer policies={policies} user={user}>
                <PunditTypeSet type="Disclosure">
                  <VisibleIf action="Create" model={{}}>
                    <Link to="/upload" className="navbar__nav-item">
                      create
                    </Link>
                  </VisibleIf>
                </PunditTypeSet>
              </PunditContainer>
            ) : (
              ""
            )}
            {isLoggedIn ? (
              <Link
                to="/user/profile/notifications"
                className="navbar__nav-item notification-count"
                data-count={numNotifications || ""}
              >
                <i className="fas fa-bell" />
              </Link>
            ) : (
              <Link to="/login" className="navbar__nav-item last">
                login
              </Link>
            )}
            <AuthWidget inNavbar={true} />
          </div>
        </nav>
      </div>
    );
  }
}

const mapState = state => {
  return {
    user: state.data.user,
    isAdmin: currentUserIsAdmin(state),
    isLoggedIn: !!state.data.user.id,
    numNotifications: getUserNotificationCount(state),
    width: state.data.environment.width
  };
};

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    },
    fetchUserNotifications() {
      dispatch(fetchUserNotifications());
    }
  };
};

export default withRouter(
  connect(mapState, mapDispatch)(asyncPoll(60 * 1000, onPollInterval)(Navbar))
);

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};
