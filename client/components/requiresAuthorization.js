import React, { Component } from "react";
import { connect } from "react-redux";
import history from "../history";
import { isEmpty } from "lodash";

export default function requiresAuthorization({ Component, roleRequired }) {
  class AuthorizationComponent extends React.Component {
    componentDidMount() {
      this.checkAndRedirect();
    }

    componentDidUpdate() {
      this.checkAndRedirect();
    }

    checkAndRedirect() {
      if (
        isEmpty(this.props.user) ||
        (roleRequired &&
          !isEmpty(this.props.user) &&
          !roleRequired.indexOf(this.props.user.roles[0].name) === -1)
      ) {
        history.push("/unauthorized");
      }
    }

    render() {
      return (
        <div className="authorized">
          <Component {...this.props} />
        </div>
      );
    }
  }

  const mapStateToProps = state => {
    return {
      user: state.data.user
    };
  };

  return connect(mapStateToProps)(AuthorizationComponent);
}
