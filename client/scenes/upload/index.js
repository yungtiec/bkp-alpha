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
  getCommentPeriodInDay,
  getSelectedProject
} from "./data/upload/reducer";
import {
  importMarkdown,
  uploadMarkdownToServer,
  addNewCollaborator,
  removeCollaborator,
  updateCommentPeriod,
  updateSelectedProject
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
  delay: 1000
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchAllProjects();
  }

  render() {
    return <LoadableSurveyUpload {...this.props} />;
  }
}

const mapState = state => {
  const { projectsBySymbol, projectSymbolArr } = getAllProjects(state);
  return {
    // global metadata
    width: state.data.environment.width,
    isLoggedIn: !!state.data.user.id,
    currentUser: state.data.user,
    sidebarOpen: state.scenes.upload.sidebarOpen,
    importedMarkdown: getImportedMarkdown(state),
    collaboratorEmails: getCollaboratorEmails(state),
    commentPeriodInDay: getCommentPeriodInDay(state),
    selectedProjectId: getSelectedProject(state),
    projectsBySymbol,
    projectSymbolArr
  };
};

const actions = {
  importMarkdown,
  uploadMarkdownToServer,
  addNewCollaborator,
  removeCollaborator,
  updateCommentPeriod,
  updateSelectedProject,
  notify,
  toggleSidebar,
  fetchAllProjects
};

export default withRouter(connect(mapState, actions)(MyComponent));
