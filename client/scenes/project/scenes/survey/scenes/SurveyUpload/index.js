import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import { batchActions } from "redux-batched-actions";
import { fetchQuestionsByProjectSurveyId } from "../../data/actions";
import { getAllSurveyQuestions } from "../../data/qnas/reducer";
import { fetchAnnotationsBySurvey } from "../../data/annotations/actions";
import { getOutstandingIssues } from "../../data/annotations/reducer";
import { getSelectedSurvey } from "../../data/metadata/reducer";
import { getSelectedProject } from "../../../../data/metadata/reducer";
import {
  getImportedMarkdown,
  getResolvedIssueId,
  getCollaboratorEmails,
  getNewIssues
} from "../../data/upload/reducer";
import {
  importMarkdown,
  uploadMarkdownToServer,
  selectIssueToResolve,
  addNewCollaborator,
  removeCollaborator,
  addNewIssue,
  removeIssue
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
      this.props.fetchQuestionsByProjectSurveyId({
        projectSurveyId: this.props.match.params.projectSurveyId
      }),
      this.props.fetchAnnotationsBySurvey(
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
    userEmail: !!state.data.user.id && state.data.user.email,
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
    newIssues: getNewIssues(state)
  };
};

const actions = {
  fetchQuestionsByProjectSurveyId,
  fetchAnnotationsBySurvey,
  importMarkdown,
  uploadMarkdownToServer,
  selectIssueToResolve,
  addNewCollaborator,
  removeCollaborator,
  addNewIssue,
  removeIssue,
  notify
};

export default withRouter(connect(mapState, actions)(MyComponent));
