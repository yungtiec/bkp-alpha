import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";

const LoadableSurveyContainer = Loadable({
  loader: () => import("./main"),
  loading: () => null,
  delay: 400
});

export default class MyComponent extends React.Component {
  render() {
    return <LoadableSurveyContainer {...this.props} />;
  }
}
