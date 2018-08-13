import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import moment from "moment";
import { batchActions } from "redux-batched-actions";

// global
import { updateOnboardStatus, loadModal } from "../../../../data/reducer";

// survey UI context
import {
  sortCommentBy,
  updateIssueFilter,
  toggleSidebar,
  toggleSidebarContext,
  toggleAnnotationHighlight,
  updateVerificationStatusInView,
  updateEngagementTabInView,
  getSidebarCommentContext,
  updateSidebarCommentContext
} from "../../reducer";

// survey/qnas
import { fetchQuestionsByProjectSurveyId } from "../../data/qnas/actions";
import { getAllSurveyQuestions } from "../../data/qnas/reducer";

// survey/metadata
import {
  upvoteSurvey,
  downvoteSurvey,
  fetchMetadataByProjectSurveyId
} from "../../data/metadata/actions";
import { getSelectedSurvey } from "../../data/metadata/reducer";

// survey/comments
import {
  fetchCommentsBySurvey,
  addNewCommentSentFromServer,
  addNewComment
} from "../../data/comments/actions";
import { getAllComments } from "../../data/comments/reducer";

// survey/tags
import {
  getAllTags,
  getTagsWithCountInSurvey,
  getTagFilter
} from "../../data/tags/reducer";
import { updateTagFilter } from "../../data/tags/actions";

const LoadableSurvey = Loadable({
  loader: () => import("./Survey"),
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
  delay: 400
});

class MyComponent extends React.Component {
  componentDidMount() {
    this.loadData({
      projectSymbol: this.props.match.params.symbol,
      projectSurveyId: this.props.match.params.projectSurveyId
    });
  }

  componentDidUpdate(prevProps) {
    const projectSymbol = this.props.match.params.symbol;
    const prevProjectSymbol = prevProps.match.params.symbol;
    const projectSurveyId = this.props.match.params.projectSurveyId;
    const prevSurveyId = prevProps.match.params.projectSurveyId;

    if (
      projectSymbol &&
      projectSurveyId &&
      (projectSymbol !== prevProjectSymbol || projectSurveyId !== prevSurveyId)
    ) {
      this.loadData({
        projectSymbol: projectSymbol,
        projectSurveyId: projectSurveyId
      });
    }
  }

  loadData({ projectSymbol, projectSurveyId }) {
    batchActions([
      this.props.fetchMetadataByProjectSurveyId(projectSurveyId),
      this.props.fetchQuestionsByProjectSurveyId(projectSurveyId),
      this.props.fetchCommentsBySurvey(projectSurveyId)
    ]);
  }

  render() {
    if (
      !this.props.surveyMetadata.id ||
      !this.props.surveyQnaIds ||
      !this.props.commentIds ||
      !this.props.commentsById
    )
      return null;
    else return <LoadableSurvey {...this.props} />;
  }
}

const mapState = state => {
  const { surveyQnasById, surveyQnaIds } = getAllSurveyQuestions(state);
  const {
    commentsById,
    commentIds,
    unfilteredCommentIds,
    nonSpamCommentIds
  } = getAllComments(state);
  const surveyMetadata = getSelectedSurvey(state);
  const {
    sidebarOpen,
    annotationHighlight,
    verificationStatus,
    commentSortBy,
    commentIssueFilter,
    sidebarContext
  } = state.scenes.survey;

  return {
    // global
    width: state.data.environment.width,
    isLoggedIn: !!state.data.user.id,
    anonymity: !!state.data.user.id && state.data.user.anonymity,
    onboard: state.data.user.onboard,
    // metadata
    isClosedForComment:
      Number(surveyMetadata.comment_until_unix) -
        Number(moment().format("x")) <=
      0,
    surveyMetadata,
    // qnas
    surveyQnasById,
    surveyQnaIds,
    // comments
    commentsById,
    commentIds,
    nonSpamCommentIds,
    unfilteredCommentIds,
    // tags
    tags: getAllTags(state),
    tagFilter: getTagFilter(state),
    tagsWithCountInSurvey: getTagsWithCountInSurvey(state),
    // UI context
    sidebarOpen,
    annotationHighlight,
    verificationStatus,
    commentSortBy,
    commentIssueFilter,
    sidebarContext,
    sidebarCommentContext: getSidebarCommentContext(state)
  };
};

const actions = {
  // global
  updateOnboardStatus,
  loadModal,
  // metadata
  fetchMetadataByProjectSurveyId,
  upvoteSurvey,
  downvoteSurvey,
  // qnas
  fetchQuestionsByProjectSurveyId,
  // comments
  fetchCommentsBySurvey,
  addNewComment,
  addNewCommentSentFromServer,
  // UI context
  sortCommentBy,
  updateTagFilter,
  updateIssueFilter,
  updateSidebarCommentContext,
  toggleSidebar,
  toggleSidebarContext,
  toggleAnnotationHighlight,
  updateVerificationStatusInView
};

export default withRouter(connect(mapState, actions)(MyComponent));
