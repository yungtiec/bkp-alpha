import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import { batchActions } from "redux-batched-actions";
import {
  sortAnnotationBy,
  sortCommentBy,
  updateIssueFilter,
  updateVerificationStatusInView,
  updateEngagementTabInView,
  getSidebarContext,
  updateSidebarContext
} from "../../reducer";
import { fetchQuestionsByProjectSurveyId } from "../../data/actions";
import { getAllSurveyQuestions } from "../../data/qnas/reducer";
import { getAllAnnotations } from "../../data/annotations/reducer";
import {
  fetchAnnotationsBySurvey,
  addNewAnnotationSentFromServer,
  editAnnotationComment
} from "../../data/annotations/actions";
import { getAllComments } from "../../data/comments/reducer";
import { fetchCommentsBySurvey } from "../../data/comments/actions";
import { getSelectedSurvey } from "../../data/metadata/reducer";
import { getSelectedProject } from "../../../../data/metadata/reducer";
import {
  getAllTags,
  getTagsWithCountInSurvey,
  getTagFilter
} from "../../data/tags/reducer";
import { updateTagFilter } from "../../data/tags/actions";

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
    if (
      !this.props.surveyQnaIds ||
      !this.props.annotationIds ||
      !this.props.commentIds ||
      !this.props.annotationsById ||
      !this.props.commentsById
    )
      return null;
    else return <LoadableSurvey {...this.props} />;
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
  const {
    sidebarOpen,
    annotationSortBy,
    commentSortBy,
    annotationIssueFilter,
    commentIssueFilter,
    engagementTab
  } = state.scenes.project.scenes.survey;
  return {
    // global metadata
    width: state.data.environment.width,
    isLoggedIn: !!state.data.user.id,
    userEmail: !!state.data.user.id && state.data.user.email,
    // project metadata
    projectMetadata: getSelectedProject(state),
    surveyMetadata: getSelectedSurvey(state),
    // survey data
    surveyQnasById,
    surveyQnaIds,
    // ann
    annotationsById,
    annotationIds,
    unfilteredAnnotationIds,
    //comment
    commentsById,
    commentIds,
    unfilteredCommentIds,
    // tab, sort, filter
    sidebarOpen,
    annotationSortBy,
    commentSortBy,
    annotationIssueFilter,
    commentIssueFilter,
    engagementTab,
    sidebarContext: getSidebarContext(state),
    // tags
    tags: getAllTags(state),
    tagFilter: getTagFilter(state),
    tagsWithCountInSurvey: getTagsWithCountInSurvey(state)
  };
};

const actions = {
  fetchQuestionsByProjectSurveyId,
  fetchAnnotationsBySurvey,
  fetchCommentsBySurvey,
  addNewAnnotationSentFromServer,
  updateEngagementTabInView,
  sortAnnotationBy,
  sortCommentBy,
  updateTagFilter,
  updateIssueFilter,
  updateSidebarContext
};

export default withRouter(connect(mapState, actions)(MyComponent));
