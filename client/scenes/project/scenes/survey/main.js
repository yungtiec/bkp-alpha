import "./index.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, route, Switch, Route, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { fetchQuestionsByProjectSurveyId } from "./data/actions";
import {
  fetchAnnotationsBySurvey,
  addNewAnnotationSentFromServer,
  editAnnotationComment
} from "./data/annotations/actions";
import { fetchCommentsBySurvey, addNewComment } from "./data/comments/actions";
import { updateTagFilter } from "./data/tags/actions";
import {
  importMarkdown,
  uploadMarkdownToServer,
  selectIssueToResolve,
  addNewCollaborator,
  removeCollaborator,
  addNewIssue,
  removeIssue
} from "./data/upload/actions";
import {
  toggleSidebar,
  sortAnnotationBy,
  sortCommentBy,
  updateIssueFilter,
  updateVerificationStatusInView,
  updateEngagementTabInView,
  getSidebarContext,
  updateSidebarContext
} from "./reducer";
import { getAllSurveyQuestions } from "./data/qnas/reducer";
import { getSelectedSurvey } from "./data/metadata/reducer";
import { getAllAnnotations } from "./data/annotations/reducer";
import { getAllComments } from "./data/comments/reducer";
import {
  getImportedMarkdown,
  getResolvedIssueId,
  getCollaboratorEmails,
  getNewIssues
} from "./data/upload/reducer";
import {
  getAllTags,
  getTagsWithCountInSurvey,
  getTagFilter
} from "./data/tags/reducer";
import { getSelectedProject } from "../../data/metadata/reducer";
import { Events, scrollSpy, animateScroll as scroll } from "react-scroll";
import { Survey, SurveyUpload } from "./components";
import autoBind from "react-autobind";
import asyncPoll from "react-async-poll";
import { batchActions } from "redux-batched-actions";

class SurveyContainer extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    Events.scrollEvent.register("begin", () => {});
    Events.scrollEvent.register("end", () => {});
    scrollSpy.update();
  }

  componentDidUpdate(prevProps) {
    const prevProjectSymbol = prevProps.match.url.split("/")[2];
    const nextProjectSymbol = this.props.match.url.split("/")[2];
    const prevSurveyId = prevProps.match.params.projectSurveyId;
    const nextSurveyId = this.props.match.params.projectSurveyId;
    if (
      prevProjectSymbol !== nextProjectSymbol ||
      prevSurveyId !== nextSurveyId
    ) {
      scroll.scrollToTop();
    }
  }

  componentWillUnmount() {
    Events.scrollEvent.remove("begin");
    Events.scrollEvent.remove("end");
    this.props.updateVerificationStatusInView("all");
  }

  componentWillReceiveProps(nextProps) {
    const prevProjectSymbol = this.props.match.url.split("/")[2];
    const nextProjectSymbol = nextProps.match.url.split("/")[2];
    const prevSurveyId = this.props.match.params.projectSurveyId;
    const nextSurveyId = nextProps.match.params.projectSurveyId;
    if (
      prevProjectSymbol &&
      prevSurveyId &&
      (prevProjectSymbol !== nextProjectSymbol || prevSurveyId !== nextSurveyId)
    ) {
      batchActions([
        this.props.fetchQuestionsByProjectSurveyId({
          projectSurveyId: nextProps.match.params.projectSurveyId
        }),
        this.props.fetchAnnotationsBySurvey(
          `${window.origin}${nextProps.match.url}`
        ),
        this.props.fetchCommentsBySurvey(
          this.props.match.params.projectSurveyId
        )
      ]);
    }
  }

  render() {
    if (
      !this.props.surveyQnaIds ||
      !this.props.annotationIds ||
      !this.props.commentIds
    )
      return null;
    return (
      <Switch>
        <Route
          path={`${this.props.match.url}/upload`}
          render={props => <SurveyUpload {...this.props} />}
        />
        <Route render={props => <Survey {...this.props} />} />
      </Switch>
    );
  }
}

const mapState = (state, ownProps) => {
  const {
    surveyQnasById,
    surveyQnaIds,
    annotationsById,
    annotationIds,
    unfilteredAnnotationIds,
    commentsById,
    commentIds,
    unfilteredCommentIds,
    outstandingIssues
  } = ownProps;
  const { width } = state.data.environment;
  const {
    sidebarOpen,
    annotationSortBy,
    commentSortBy,
    annotationIssueFilter,
    commentIssueFilter,
    engagementTab
  } = state.scenes.project.scenes.survey;
  return {
    isLoggedIn: !!state.data.user.id,
    myUserId: state.data.user.id,
    sidebarContext: getSidebarContext(state),
    surveyQnasById,
    surveyQnaIds,
    surveyMetadata: getSelectedSurvey(state),
    projectSurveyId: ownProps.match.params.projectSurveyId,
    projectMetadata: getSelectedProject(state),
    annotationsById,
    annotationIds,
    unfilteredAnnotationIds,
    tags: getAllTags(state),
    tagFilter: getTagFilter(state),
    tagsWithCountInSurvey: getTagsWithCountInSurvey(state),
    width,
    sidebarOpen,
    annotationSortBy,
    commentSortBy,
    annotationIssueFilter,
    commentIssueFilter,
    engagementTab,
    commentsById,
    commentIds,
    unfilteredCommentIds,
    outstandingIssues,
    importedMarkdown: getImportedMarkdown(state),
    resolvedIssueIds: getResolvedIssueId(state),
    collaboratorEmails: getCollaboratorEmails(state),
    newIssues: getNewIssues(state)
  };
};

const actions = {
  fetchQuestionsByProjectSurveyId,
  fetchAnnotationsBySurvey,
  addNewAnnotationSentFromServer,
  editAnnotationComment,
  toggleSidebar,
  sortAnnotationBy,
  updateTagFilter,
  updateVerificationStatusInView,
  updateEngagementTabInView,
  fetchCommentsBySurvey,
  addNewComment,
  sortCommentBy,
  updateIssueFilter,
  updateSidebarContext,
  importMarkdown,
  uploadMarkdownToServer,
  selectIssueToResolve,
  addNewCollaborator,
  removeCollaborator,
  addNewIssue,
  removeIssue
};

const onPollInterval = (props, dispatch) => {
  return props.fetchAnnotationsBySurvey(`${window.origin}${props.match.url}`);
};

export default withRouter(connect(mapState, actions)(SurveyContainer));
