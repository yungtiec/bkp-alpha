import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, route, Switch, Route, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Events, scrollSpy, animateScroll as scroll } from "react-scroll";
import { SurveyUpload, SurveyProgress } from "./components";
import Survey from "./scenes/Survey";
import autoBind from "react-autobind";
import { updateVerificationStatusInView } from "./reducer";

class SurveyContainer extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    Events.scrollEvent.register("begin", () => {});
    Events.scrollEvent.register("end", () => {});
    scrollSpy.update();
  }

  componentDidUpdate(prevProps) {
    const prevProjectSymbol = prevProps.match.url.split("/")[2];
    const nextProjectSymbol = this.props.match.url.split("/")[2];
    const prevSurveyId = prevProps.match.params.projectSurveyId;
    const nextSurveyId = this.props.match.params.projectSurveyId;
    if (
      prevProjectSymbol !== nextProjectSymbol ||
      prevSurveyId !== nextSurveyId
    ) {
      scroll.scrollToTop();
    }
  }

  componentWillUnmount() {
    Events.scrollEvent.remove("begin");
    Events.scrollEvent.remove("end");
    this.props.updateVerificationStatusInView("all");
  }

  render() {
    console.log("?");
    return (
      <Switch>
        <Route
          path={`${this.props.match.url}/upload`}
          render={props => <SurveyUpload />}
        />
        <Route
          path={`${this.props.match.url}/progress`}
          render={props => <SurveyProgress />}
        />
        <Route render={props => <Survey />} />
      </Switch>
    );
  }
}

export default withRouter(
  connect(() => ({}), { updateVerificationStatusInView })(SurveyContainer)
);
