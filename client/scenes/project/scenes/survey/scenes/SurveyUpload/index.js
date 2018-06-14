import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import { batchActions } from "redux-batched-actions";
import { fetchProjectBySymbol } from "../../../../data/actions";
import { fetchQuestionsByProjectSurveyId } from "../../data/actions";
import { getAllSurveyQuestions } from "../../data/qnas/reducer";
import { fetchCommentsBySurvey } from "../../data/comments/actions";
import { getOutstandingIssues } from "../../data/comments/reducer";
import { getSelectedSurvey } from "../../data/metadata/reducer";
import { getSelectedProject } from "../../../../data/metadata/reducer";
import { toggleSidebar } from "../../reducer";
import {
  getImportedMarkdown,
  getResolvedIssueId,
  getCollaboratorEmails,
  getNewIssues,
  getCommentPeriodInDay
} from "../../data/upload/reducer";
import {
  importMarkdown,
  uploadMarkdownToServer,
  selectIssueToResolve,
  addNewCollaborator,
  removeCollaborator,
  addNewIssue,
  removeIssue,
  updateCommentPeriod
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
  delay: 1000
});

class MyComponent extends React.Component {
  componentDidMount() {
    batchActions([
      this.props.fetchProjectBySymbol(projectSymbol),
      this.props.fetchQuestionsByProjectSurveyId({
        projectSymbol: this.props.match.params.symbol,
        projectSurveyId: this.props.match.params.projectSurveyId
      }),
      this.props.fetchCommentsBySurvey({
        projectSymbol: this.props.match.params.symbol,
        projectSurveyId: this.props.match.params.projectSurveyId
      })
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
    userEmail: !!state.data.user.id && state.data.user.email,
    sidebarOpen: state.scenes.project.scenes.survey.sidebarOpen,
    // project metadata
    projectMetadata: getSelectedProject(state),
    surveyMetadata: getSelectedSurvey(state),
    // survey data
    surveyQnasById,
    surveyQnaIds,
    // outstanding issues
    outstandingIssues: getOutstandingIssues(state),
    importedMarkdown: getImportedMarkdown(state),
    resolvedIssueIds: getResolvedIssueId(state),
    collaboratorEmails: getCollaboratorEmails(state),
    newIssues: getNewIssues(state),
    commentPeriodInDay: getCommentPeriodInDay(state)
  };
};

const actions = {
  fetchProjectBySymbol,
  fetchQuestionsByProjectSurveyId,
  fetchCommentsBySurvey,
  importMarkdown,
  uploadMarkdownToServer,
  selectIssueToResolve,
  addNewCollaborator,
  removeCollaborator,
  addNewIssue,
  removeIssue,
  updateCommentPeriod,
  notify,
  toggleSidebar
};

export default withRouter(connect(mapState, actions)(MyComponent));
