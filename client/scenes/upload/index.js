import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import { batchActions } from "redux-batched-actions";
import { toggleSidebar } from "./reducer";
import {
  getImportedMarkdown,
  getCollaboratorEmails,
  getCollaboratorOptions,
  getCommentPeriodInDay,
  getSelectedProject,
  getManagedProjects,
  getProjectScorecardStatus
} from "./data/upload/reducer";
import {
  fetchManagedProjects,
  importMarkdown,
  uploadMarkdownToServer,
  updateCollaborators,
  removeCollaborator,
  updateCommentPeriod,
  updateSelectedProject,
  updateProjectScorecard
} from "./data/upload/actions";
import { fetchAllProjects } from "../../data/reducer";
import { getAllProjects } from "../../data/reducer";
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
    let Upload = loaded.default;
    return <Upload {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchManagedProjects();
  }

  render() {
    return <LoadableSurveyUpload {...this.props} />;
  }
}

const mapState = state => {
  const { projectsBySymbol, projectSymbolArr } = getManagedProjects(state);
  return {
    // global metadata
    width: state.data.environment.width,
    isLoggedIn: !!state.data.user.id,
    currentUser: state.data.user,
    sidebarOpen: state.scenes.upload.sidebarOpen,
    importedMarkdown: getImportedMarkdown(state),
    collaboratorEmails: getCollaboratorEmails(state),
    collaboratorOptions: getCollaboratorOptions(state),
    commentPeriodInDay: getCommentPeriodInDay(state),
    selectedProject: getSelectedProject(state),
    scorecardCompleted: getProjectScorecardStatus(state),
    projectsBySymbol,
    projectSymbolArr
  };
};

const actions = {
  fetchManagedProjects,
  importMarkdown,
  uploadMarkdownToServer,
  updateCollaborators,
  removeCollaborator,
  updateCommentPeriod,
  updateSelectedProject,
  notify,
  toggleSidebar,
  fetchAllProjects,
  updateProjectScorecard
};

export default withRouter(connect(mapState, actions)(MyComponent));
