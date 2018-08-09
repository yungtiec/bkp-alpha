import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import { batchActions } from "redux-batched-actions";
import { upvoteSurvey } from "../../data/metadata/actions";
import {
  getAllSurveyQuestions,
  fetchQuestionsByProjectSurveyId
} from "../../data/qnas/reducer";
import { fetchCommentsBySurvey } from "../../data/comments/actions";
import { getOutstandingIssues } from "../../data/comments/reducer";
import { getSelectedSurvey } from "../../data/metadata/reducer";
import { toggleSidebar } from "../../reducer";
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
import { notify } from "reapop";

const LoadableSurveyUpload = Loadable({
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
    let SurveyProgress = loaded.default;
    return <SurveyProgress {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  componentDidMount() {
    batchActions([
      this.props.fetchQuestionsByProjectSurveyId(
        this.props.match.params.projectSurveyId
      ),
      this.props.fetchCommentsBySurvey(this.props.match.params.projectSurveyId),
      this.props.fetchCollaboratorOptions(
        this.props.match.params.projectSurveyId
      )
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
    // project metadata
    surveyMetadata: getSelectedSurvey(state),
    // survey data
    surveyQnasById,
    surveyQnaIds,
    // outstanding issues
    outstandingIssues: getOutstandingIssues(state),
    importedMarkdown: getImportedMarkdown(state),
    resolvedIssueIds: getResolvedIssueId(state),
    collaboratorEmails: getCollaboratorEmails(state),
    collaboratorOptions: getCollaboratorOptions(state),
    newIssues: getNewIssues(state),
    // comment period
    commentPeriodUnit: getCommentPeriodUnit(state),
    commentPeriodValue: getCommentPeriodValue(state),
    // scorecard
    scorecardCompleted: getProjectScorecardStatus(state),
    scorecard: getProjectScorecard(state)
  };
};

const actions = {
  fetchCollaboratorOptions,
  fetchQuestionsByProjectSurveyId,
  upvoteSurvey,
  fetchCommentsBySurvey,
  importMarkdown,
  uploadMarkdownToServer,
  selectIssueToResolve,
  updateCollaborators,
  addNewIssue,
  removeIssue,
  updateCommentPeriodUnit,
  updateCommentPeriodValue,
  notify,
  toggleSidebar,
  updateProjectScorecard
};

export default withRouter(connect(mapState, actions)(MyComponent));
