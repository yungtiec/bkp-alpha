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

const onPollInterval = (props, dispatch) => {
  return props.fetchUserNotifications();
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  state = {
    showFilters: false
  };

  setSearchBarRef(input) {
    this.searchBar = input;
  }

  handleSearchIconOnClick() {
    this.setState(state => ({ showSearchBar: !state.showSearchBar }));
  }

  render() {
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
            {this.props.isAdmin ? (
              <Link to="/admin" className="navbar__nav-item">
                admin
              </Link>
            ) : (
              ""
            )}
            <Link to="/projects" className="navbar__nav-item">
              projects
            </Link>
            {this.props.isLoggedIn ? (
              <Link
                to="/user/profile/notifications"
                className="navbar__nav-item notification-count"
                data-count={this.props.numNotifications || ""}
              >
                <i className="fas fa-bell" />
              </Link>
            ) : null}
            <AuthWidget inNavbar={true} />
          </div>
        </nav>
      </div>
    );
  }
}

const mapState = state => {
  return {
    isAdmin: currentUserIsAdmin(state),
    isLoggedIn: !!state.data.user.id,
    numNotifications: getUserNotificationCount(state)
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
