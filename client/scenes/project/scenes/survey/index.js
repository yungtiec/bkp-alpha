import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import { fetchQuestionsBySurveyId } from "./data/actions";
import {
  fetchAnnotationsBySurvey
} from "./data/annotations/actions";
import { fetchCommentsBySurvey } from "./data/comments/actions";
import { batchActions } from "redux-batched-actions";

const LoadableSurvey = Loadable({
  loader: () => import("./main"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let Survey = loaded.default;
    return <Survey {...props} />;
  },
  delay: 1000
});

class MyComponent extends React.Component {
  componentDidMount() {
    batchActions([
      this.props.fetchQuestionsBySurveyId({
        projectSymbol: this.props.match.url.split("/")[2],
        surveyId: this.props.match.params.surveyId
      }),
      this.props.fetchAnnotationsBySurvey(
        `${window.origin}${this.props.match.url}`
      ),
      this.props.fetchCommentsBySurvey(this.props.match.params.surveyId)
    ]);
  }

  render() {
    return <LoadableSurvey />;
  }
}

const actions = {
  fetchQuestionsBySurveyId,
  fetchAnnotationsBySurvey,
  fetchCommentsBySurvey
};


export default withRouter(connect(() => ({}), actions)(MyComponent));
