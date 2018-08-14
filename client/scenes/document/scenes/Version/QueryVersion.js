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
import { fetchQuestionsByVersionId } from "../../data/qnas/actions";
import { getAllDocumentQuestions } from "../../data/qnas/reducer";

// document/metadata
import {
  upvoteDocument,
  downvoteDocument,
  fetchMetadataByVersionId
} from "../../data/metadata/actions";
import { getSelectedDocument } from "../../data/metadata/reducer";

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

const LoadableDocument = Loadable({
  loader: () => import("./Version"),
  loading: () => (
    <SquareLoader
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
    batchActions([
      this.props.fetchMetadataByVersionId(versionId),
      this.props.fetchQuestionsByVersionId(versionId),
      this.props.fetchCommentsByVersionId(versionId)
    ]);
  }

  render() {
    if (
      !this.props.documentMetadata.id ||
      !this.props.documentQnaIds ||
      !this.props.commentIds ||
      !this.props.commentsById
    )
      return null;
    else return <LoadableDocument {...this.props} />;
  }
}

const mapState = state => {
  const { documentQnasById, documentQnaIds } = getAllDocumentQuestions(state);
  const {
    commentsById,
    commentIds,
    unfilteredCommentIds,
    nonSpamCommentIds
  } = getAllComments(state);
  const documentMetadata = getSelectedDocument(state);
  const {
    sidebarOpen,
    annotationHighlight,
    verificationStatus,
    commentSortBy,
    commentIssueFilter,
    sidebarContext
  } = state.scenes.document;

  return {
    // global
    width: state.data.environment.width,
    isLoggedIn: !!state.data.user.id,
    anonymity: !!state.data.user.id && state.data.user.anonymity,
    onboard: state.data.user.onboard,
    // metadata
    isClosedForComment:
      Number(documentMetadata.comment_until_unix) -
        Number(moment().format("x")) <=
      0,
    documentMetadata,
    // qnas
    documentQnasById,
    documentQnaIds,
    // comments
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
  // qnas
  fetchQuestionsByVersionId,
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

export default withRouter(connect(mapState, actions)(MyComponent));
