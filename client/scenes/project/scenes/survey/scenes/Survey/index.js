import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import moment from "moment";
import { batchActions } from "redux-batched-actions";
import { updateOnboardStatus, loadModal } from "../../../../../../data/reducer";
import { fetchProjectBySymbol } from "../../../../data/actions";
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
import {
  fetchQuestionsByProjectSurveyId,
<<<<<<< HEAD
  upvoteProjectSurvey,
  downvoteProjectSurvey
=======
  upvoteSurvey
>>>>>>> db-refactor
} from "../../data/actions";
import {
  fetchCommentsBySurvey,
  addNewCommentSentFromServer,
  addNewComment
} from "../../data/comments/actions";
import { getAllSurveyQuestions } from "../../data/qnas/reducer";
import { getAllComments } from "../../data/comments/reducer";
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
      this.props.fetchProjectBySymbol(projectSymbol),
      this.props.fetchQuestionsByProjectSurveyId({
        projectSymbol: projectSymbol,
        projectSurveyId: projectSurveyId
      }),
      this.props.fetchCommentsBySurvey({
        projectSymbol: projectSymbol,
        projectSurveyId: projectSurveyId
      })
    ]);
  }

  render() {
    if (
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
  const { commentsById, commentIds, unfilteredCommentIds } = getAllComments(
    state
  );
  const surveyMetadata = getSelectedSurvey(state);
  const {
    sidebarOpen,
    annotationHighlight,
    verificationStatus,
    commentSortBy,
    commentIssueFilter,
    sidebarContext
  } = state.scenes.project.scenes.survey;

  return {
    // global metadata
    width: state.data.environment.width,
    isLoggedIn: !!state.data.user.id,
    anonymity: !!state.data.user.id && state.data.user.anonymity,
    onboard: state.data.user.onboard,
    isClosedForComment:
      Number(surveyMetadata.comment_until_unix) -
        Number(moment().format("x")) <=
      0,
    // project metadata
    projectMetadata: getSelectedProject(state),
    surveyMetadata,
    // survey data
    surveyQnasById,
    surveyQnaIds,
    // ann
    commentsById,
    commentIds,
    unfilteredCommentIds,
    // tab, sort, filter
    sidebarOpen,
    annotationHighlight,
    verificationStatus,
    commentSortBy,
    commentIssueFilter,
    sidebarContext,
    sidebarCommentContext: getSidebarCommentContext(state),
    // tags
    tags: getAllTags(state),
    tagFilter: getTagFilter(state),
    tagsWithCountInSurvey: getTagsWithCountInSurvey(state)
  };
};

const actions = {
  fetchProjectBySymbol,
  fetchQuestionsByProjectSurveyId,
<<<<<<< HEAD
  upvoteProjectSurvey,
  downvoteProjectSurvey,
=======
  upvoteSurvey,
>>>>>>> db-refactor
  fetchCommentsBySurvey,
  addNewComment,
  addNewCommentSentFromServer,
  sortCommentBy,
  updateTagFilter,
  updateIssueFilter,
  updateSidebarCommentContext,
  toggleSidebar,
  toggleSidebarContext,
  toggleAnnotationHighlight,
  updateVerificationStatusInView,
  updateOnboardStatus,
  loadModal
};

export default withRouter(connect(mapState, actions)(MyComponent));
