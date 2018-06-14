import React, { Component } from "react";
import { connect } from "react-redux";
import history from "../history";
import { isEmpty } from "lodash";

export default function requiresAuthorization({
  Component,
  roleRequired,
  checkSurveyEditRight
}) {
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
          !this.props.user.roles.filter(r => r.name === roleRequired).length) ||
        (checkSurveyEditRight &&
          (this.props.user.email !== this.props.surveyMetadata.creator.email &&
            !this.props.surveyMetadata.collaborators.reduce(
              (bool, c) => c.email === this.props.user.email || bool,
              false
            )))
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
      user: state.data.user,
      surveyMetadata: state.scenes.project.scenes.survey.data.metadata
    };
  };

  return connect(mapStateToProps)(AuthorizationComponent);
}
