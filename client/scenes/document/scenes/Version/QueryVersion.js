import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import moment from "moment";
import { batchActions } from "redux-batched-actions";

// global
import { updateOnboardStatus, loadModal } from "../../../../data/reducer";

// document UI context
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

// document/qnas
import {
  fetchQuestionsByVersionId,
  toggleQuestionEditor,
  toggleAnswerEditor,
  editQuestion,
  editAnswer,
  revertToPrevQuestion,
  revertToPrevAnswer
} from "../../data/versionQnas/actions";
import { getAllDocumentQuestions } from "../../data/versionQnas/reducer";

// document/metadata
import {
  fetchMetadataByVersionId,
  editScorecard
} from "../../data/versionMetadata/actions";
import { getVersionMetadata } from "../../data/versionMetadata/reducer";
import {
  upvoteDocument,
  downvoteDocument
} from "../../data/documentMetadata/actions";
import { getDocumentMetadata } from "../../data/documentMetadata/reducer";

// document/comments
import {
  fetchCommentsByVersionId,
  addNewCommentSentFromServer,
  addNewComment
} from "../../data/comments/actions";
import { getAllComments } from "../../data/comments/reducer";

// document/tags
import {
  getAllTags,
  getTagsWithCountInDocument,
  getTagFilter
} from "../../data/tags/reducer";
import { updateTagFilter } from "../../data/tags/actions";

const LoadableVersion = Loadable({
  loader: () => import("./Version"),
  loading: () => (
    <SquareLoader
      key="LoadableVersion"
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let Version = loaded.default;
    return <Version {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  componentDidMount() {
    this.loadData({
      projectSymbol: this.props.match.params.symbol,
      versionId: this.props.match.params.versionId
    });
  }

  componentDidUpdate(prevProps) {
    const projectSymbol = this.props.match.params.symbol;
    const prevProjectSymbol = prevProps.match.params.symbol;
    const versionId = this.props.match.params.versionId;
    const prevVersionId = prevProps.match.params.versionId;
    if (
      projectSymbol &&
      versionId &&
      (projectSymbol !== prevProjectSymbol || versionId !== prevVersionId)
    ) {
      this.loadData({
        projectSymbol: projectSymbol,
        versionId: versionId
      });
    }
  }

  loadData({ projectSymbol, versionId }) {
    this.props.fetchMetadataByVersionId(versionId);
    this.props.fetchQuestionsByVersionId(versionId);
    this.props.fetchCommentsByVersionId(versionId);
  }

  render() {
    return <LoadableVersion {...this.props} />;
  }
}

const mapState = state => {
  const {
    versionQnasById,
    versionQnaIds,
    versionQnasLoading
  } = getAllDocumentQuestions(state);
  const {
    commentsById,
    commentIds,
    unfilteredCommentIds,
    nonSpamCommentIds,
    commentsLoading
  } = getAllComments(state);
  const {
    sidebarOpen,
    annotationHighlight,
    verificationStatus,
    commentSortBy,
    commentIssueFilter,
    sidebarContext
  } = state.scenes.document;
  const { versionMetadata, versionMetadataLoading } = getVersionMetadata(state);

  return {
    // global
    width: state.data.environment.width,
    isLoggedIn: !!state.data.user.id,
    anonymity: !!state.data.user.id && state.data.user.anonymity,
    onboard: state.data.user.onboard,
    // metadata
    isClosedForComment:
      Number(versionMetadata.comment_until_unix) -
        Number(moment().format("x")) <=
      0,
    versionMetadataLoading,
    versionMetadata,
    documentMetadata: getDocumentMetadata(state),
    // qnas
    versionQnasLoading,
    versionQnasById,
    versionQnaIds,
    // comments
    commentsLoading,
    commentsById,
    commentIds,
    nonSpamCommentIds,
    unfilteredCommentIds,
    // tags
    tags: getAllTags(state),
    tagFilter: getTagFilter(state),
    tagsWithCountInDocument: getTagsWithCountInDocument(state),
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
  fetchMetadataByVersionId,
  upvoteDocument,
  downvoteDocument,
  editScorecard,
  // qnas
  fetchQuestionsByVersionId,
  editQuestion,
  editAnswer,
  toggleQuestionEditor,
  toggleAnswerEditor,
  revertToPrevQuestion,
  revertToPrevAnswer,
  // comments
  fetchCommentsByVersionId,
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

export default withRouter(
  connect(
    mapState,
    actions
  )(MyComponent)
);
