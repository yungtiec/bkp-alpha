import "./Navbar.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { logout } from "../data/reducer";

class Navbar extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    console.log(this.props.match)
    return (
      <div className="header">
        <nav className="navbar navbar-expand-md no-gutters navbar--logo">
          <div className="box--left">
            <div className="logo-header">
              <img
                width="70px"
                height="auto"
                className="logo__large"
                src="/assets/the-brooklyn-project-logo-border.png"
              />
            </div>
          </div>
          <div className="box--right">
            <div className="icon-container">
              <i className="fas fa-search" />
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

const mapState = state => {
  return {
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
