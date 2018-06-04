import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import { fetchQuestionsByProjectSurveyId } from "./data/actions";
import { fetchAnnotationsBySurvey } from "./data/annotations/actions";
import { fetchCommentsBySurvey } from "./data/comments/actions";
import { batchActions } from "redux-batched-actions";
import { getAllSurveyQuestions } from "./data/qnas/reducer";
import { getAllAnnotations } from "./data/annotations/reducer";
import { getAllComments } from "./data/comments/reducer";
import { getOutstandingIssues } from "./data/reducer";

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
      this.props.fetchQuestionsByProjectSurveyId({
        projectSurveyId: this.props.match.params.projectSurveyId
      }),
      this.props.fetchAnnotationsBySurvey(
        `${window.origin}${this.props.match.url}`
      ),
      this.props.fetchCommentsBySurvey(this.props.match.params.projectSurveyId)
    ]);
  }

  render() {
    return <LoadableSurvey {...this.props} />;
  }
}

const mapState = state => {
  const { surveyQnasById, surveyQnaIds } = getAllSurveyQuestions(state);
  const {
    annotationsById,
    annotationIds,
    unfilteredAnnotationIds
  } = getAllAnnotations(state);
  const { commentsById, commentIds, unfilteredCommentIds } = getAllComments(
    state
  );
  return {
    surveyQnasById,
    surveyQnaIds,
    annotationsById,
    annotationIds,
    unfilteredAnnotationIds,
    commentsById,
    commentIds,
    unfilteredCommentIds,
    outstandingIssues: getOutstandingIssues(state)
  };
};

const actions = {
  fetchQuestionsByProjectSurveyId,
  fetchAnnotationsBySurvey,
  fetchCommentsBySurvey
};

export default withRouter(connect(mapState, actions)(MyComponent));
