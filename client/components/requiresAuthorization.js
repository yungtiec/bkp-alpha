import React, { Component } from "react";
import { connect } from "react-redux";
import history from "../history";

export default function requiresAuthorization(Component, roleRequired) {
  class AuthorizationComponent extends React.Component {
    componentDidMount() {
      this.checkAndRedirect();
    }

    componentDidUpdate() {
      this.checkAndRedirect();
    }

    checkAndRedirect() {
      if (
        !this.props.user ||
        (this.props.user &&
          !this.props.user.roles.filter(r => r.name === roleRequired).length)
      ) {
        history.push("/unauthorized");
      }
    }

    render() {
      return (
        <div className="authorized">
          {this.props.user &&
          this.props.user.roles.filter(r => r.name === roleRequired).length ? (
            <Component {...this.props} />
          ) : ''}
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
