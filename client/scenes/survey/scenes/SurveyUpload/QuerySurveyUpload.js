import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import { batchActions } from "redux-batched-actions";
import { notify } from "reapop";
// metadata
import {
  upvoteSurvey,
  downvoteSurvey,
  fetchMetadataByProjectSurveyId
} from "../../data/metadata/actions";
import { getSelectedSurvey } from "../../data/metadata/reducer";
// qnas
import { getAllSurveyQuestions } from "../../data/qnas/reducer";
import { fetchQuestionsByProjectSurveyId } from "../../data/qnas/actions";
// comments
import { fetchCommentsBySurvey } from "../../data/comments/actions";
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

const LoadableSurveyUpload = Loadable({
  loader: () => import("./SurveyUpload"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let SurveyProgress = loaded.default;
    return <SurveyProgress {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  componentDidMount() {
    batchActions([
      this.props.fetchMetadataByProjectSurveyId(
        this.props.match.params.projectSurveyId
      ),
      this.props.fetchQuestionsByProjectSurveyId(
        this.props.match.params.projectSurveyId
      ),
      this.props.fetchCommentsBySurvey(this.props.match.params.projectSurveyId),
      this.props.fetchCollaboratorOptions(this.props.match.params.symbol)
    ]);
  }

  render() {
    if (
      !this.props.surveyMetadata.id ||
      !this.props.surveyQnaIds ||
      !this.props.outstandingIssues
    )
      return null;
    else return <LoadableSurveyUpload {...this.props} />;
  }
}

const mapState = state => {
  const { surveyQnasById, surveyQnaIds } = getAllSurveyQuestions(state);
  return {
    // global metadata
    width: state.data.environment.width,
    isLoggedIn: !!state.data.user.id,
    sidebarOpen: state.scenes.survey.sidebarOpen,
    // metadata
    surveyMetadata: getSelectedSurvey(state),
    // qnas
    surveyQnasById,
    surveyQnaIds,
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
  fetchQuestionsByProjectSurveyId,
  // metadata
  fetchMetadataByProjectSurveyId,
  upvoteSurvey,
  downvoteSurvey,
  // comments
  fetchCommentsBySurvey,
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
