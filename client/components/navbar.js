import "./Navbar.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { logout } from "../data/reducer";
import { AuthWidget, SearchBar } from "./index";

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
        {!this.state.showSearchBar && (
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
              ) : ""}
              <Link to="/projects" className="navbar__nav-item">
                projects
              </Link>
              <div
                className="navbar__nav-item"
                onClick={this.handleSearchIconOnClick}
              >
                <i className="fas fa-search" />
              </div>
              <AuthWidget inNavbar={true} />
            </div>
          </nav>
        )}
        {this.state.showSearchBar && (
          <SearchBar
            handleSearchIconOnClick={this.handleSearchIconOnClick}
            setSearchBarRef={this.setSearchBarRef}
          />
        )}
      </div>
    );
  }
}

const mapState = state => {
  return {
    isAdmin:
      !!state.data.user.roles &&
      state.data.user.roles.filter(role => role.name === "admin").length,
    isLoggedIn: !!state.data.user.id
  };
};

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    }
  };
};

export default withRouter(connect(mapState, mapDispatch)(Navbar));

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};
