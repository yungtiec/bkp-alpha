import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import { batchActions } from "redux-batched-actions";
import { notify } from "reapop";
// metadata
import {
  upvoteDocument,
  downvoteDocument,
  fetchMetadataByVersionId
} from "../../data/metadata/actions";
import { getSelectedDocument } from "../../data/metadata/reducer";
// qnas
import { getAllDocumentQuestions } from "../../data/qnas/reducer";
import { fetchQuestionsByVersionId } from "../../data/qnas/actions";
// comments
import { fetchCommentsByVersionId } from "../../data/comments/actions";
import { getOutstandingIssues } from "../../data/comments/reducer";
// upload
import {
  getImportedMarkdown,
  getResolvedIssueId,
  getCollaboratorEmails,
  getCollaboratorOptions,
  getNewIssues,
  getCommentPeriodUnit,
  getCommentPeriodValue,
  getProjectScorecardStatus,
  getProjectScorecard
} from "../../data/upload/reducer";
import {
  fetchCollaboratorOptions,
  importMarkdown,
  uploadMarkdownToServer,
  selectIssueToResolve,
  updateCollaborators,
  addNewIssue,
  removeIssue,
  updateCommentPeriodUnit,
  updateCommentPeriodValue,
  updateProjectScorecard
} from "../../data/upload/actions";
// UI context
import { toggleSidebar } from "../../reducer";

const LoadableVersionUpload = Loadable({
  loader: () => import("./VersionUpload"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let VersionUpload = loaded.default;
    return <VersionUpload {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  componentDidMount() {
    batchActions([
      this.props.fetchMetadataByVersionId(
        this.props.match.params.versionId
      ),
      this.props.fetchQuestionsByVersionId(
        this.props.match.params.versionId
      ),
      this.props.fetchCommentsByVersionId(this.props.match.params.versionId),
      this.props.fetchCollaboratorOptions(this.props.match.params.symbol)
    ]);
  }

  render() {
    if (
      !this.props.documentMetadata.id ||
      !this.props.documentQnaIds ||
      !this.props.outstandingIssues
    )
      return null;
    else return <LoadableVersionUpload {...this.props} />;
  }
}

const mapState = state => {
  const { documentQnasById, documentQnaIds } = getAllDocumentQuestions(state);
  return {
    // global metadata
    width: state.data.environment.width,
    isLoggedIn: !!state.data.user.id,
    sidebarOpen: state.scenes.document.sidebarOpen,
    // metadata
    documentMetadata: getSelectedDocument(state),
    // qnas
    documentQnasById,
    documentQnaIds,
    // outstanding issues
    outstandingIssues: getOutstandingIssues(state),
    // upload
    importedMarkdown: getImportedMarkdown(state),
    resolvedIssueIds: getResolvedIssueId(state),
    collaboratorEmails: getCollaboratorEmails(state),
    collaboratorOptions: getCollaboratorOptions(state),
    newIssues: getNewIssues(state),
    // comment
    commentPeriodUnit: getCommentPeriodUnit(state),
    commentPeriodValue: getCommentPeriodValue(state),
    // scorecard
    scorecardCompleted: getProjectScorecardStatus(state),
    scorecard: getProjectScorecard(state)
  };
};

const actions = {
  // global UI context
  notify,
  // qnas
  fetchQuestionsByVersionId,
  // metadata
  fetchMetadataByVersionId,
  upvoteDocument,
  downvoteDocument,
  // comments
  fetchCommentsByVersionId,
  // upload
  fetchCollaboratorOptions,
  importMarkdown,
  uploadMarkdownToServer,
  selectIssueToResolve,
  updateCollaborators,
  addNewIssue,
  removeIssue,
  updateCommentPeriodUnit,
  updateCommentPeriodValue,
  updateProjectScorecard,
  // UI context
  toggleSidebar
};

export default withRouter(connect(mapState, actions)(MyComponent));
