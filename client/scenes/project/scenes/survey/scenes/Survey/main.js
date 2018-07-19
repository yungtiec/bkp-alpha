import React, { Component } from "react";
import autoBind from "react-autobind";
import { batchActions } from "redux-batched-actions";
import { SquareLoader } from "halogenium";
import { Link, Switch, Route } from "react-router-dom";
import {
  Link as ScrollLink,
  Element,
  animateScroll as scroll,
  scroller
} from "react-scroll";
import { connect } from "react-redux";
import { SurveyContent, SurveyProgress, SurveyIssues } from "./components";
import {
  SidebarComments,
  SidebarHeader,
  SurveyHeader,
  VersionToolbar
} from "../../components";
import { findCommentsInQnaByText } from "../../utils";
import { SidebarLayout, CustomScrollbar } from "../../../../../../components";

class Survey extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount(nextProps) {
    this.focusOnContext();
  }

  focusOnContext() {
    const givenCommentContext =
      window.location.pathname.indexOf("/comment/") !== -1;
    const givenQnaContext =
      window.location.pathname.indexOf("/question/") !== -1;
    var commentId, qnaId, pos, comments;
    if (givenCommentContext) {
      pos = window.location.pathname.indexOf("/comment/");
      commentId = window.location.pathname.substring(pos).split("/")[2];
      if (givenQnaContext) {
        pos = window.location.pathname.indexOf("/question/");
        qnaId = window.location.pathname.substring(pos).split("/")[2];
        scroller.scrollTo(`qna-${qnaId}`);
      }
      if (this.props.commentsById[Number(commentId)]) {
        this.props.updateSidebarContext({
          selectedCommentId: Number(commentId),
          focusOnce: true
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const givenCommentContext =
      this.props.location.pathname.indexOf("/comment/") !== -1;
    if (
      (JSON.stringify(prevProps.commentsById) !==
        JSON.stringify(this.props.commentsById) ||
        this.props.location.pathname !== prevProps.location.pathname) &&
      givenCommentContext
    ) {
      this.focusOnContext();
    }
  }

  componentWillUnmount() {
    this.resetSidebarContext();
  }

  resetSidebarContext() {
    this.props.updateSidebarContext({
      selectedText: "",
      selectedComments: null,
      focusOnce: false,
      selectedCommentId: null
    });
  }

  commentOnClick(evt, qnaId, answerId) {
    const selectedTextByUser = window.getSelection
      ? "" + window.getSelection()
      : document.selection.createRange().text;
    if (selectedTextByUser) return;
    if (!qnaId && !answerId) return;
    const selectedText = evt.target.innerHTML;
    const comments = findCommentsInQnaByText({
      commentIds: this.props.unfilteredCommentIds,
      commentsById: this.props.commentsById,
      text: selectedText,
      qnaId
    });
    if (!this.props.sidebarOpen && comments && comments.length) {
      this.props.toggleSidebar();
    }
    if (comments && comments.length) {
      this.props.updateSidebarContext({
        focusQnaId: qnaId,
        selectedText
      });
    }
  }

  getSelectedComments() {
    const { sidebarContext, unfilteredCommentIds, commentsById } = this.props;
    if (sidebarContext.selectedText)
      return findCommentsInQnaByText({
        commentIds: unfilteredCommentIds,
        commentsById: commentsById,
        text: sidebarContext.selectedText,
        qnaId: sidebarContext.focusQnaId
      });
    else if (
      sidebarContext.selectedCommentId &&
      commentsById[sidebarContext.selectedCommentId]
    )
      return [commentsById[sidebarContext.selectedCommentId]];
    else return [];
  }

  resetContext() {
    this.props.updateSidebarContext({
      selectedText: "",
      focusQnaId: "",
      selectedCommentId: ""
    });
  }

  render() {
    const {
      surveyQnasById,
      surveyQnaIds,
      surveyMetadata,
      projectMetadata,
      commentsById,
      commentIds,
      unfilteredCommentIds,
      isLoggedIn,
      isClosedForComment,
      userEmail,
      match,
      width,
      commentSortBy,
      sortCommentBy,
      tags,
      tagsWithCountInSurvey,
      tagFilter,
      updateTagFilter,
      addNewCommentSentFromServer,
      sidebarContext,
      commentIssueFilter,
      updateIssueFilter,
      addNewComment,
      sidebarOpen,
      verificationStatus,
      toggleSidebar,
      updateVerificationStatusInView,
      upvoteSurvey
    } = this.props;

    const selectedComments = this.getSelectedComments();

    return (
      <div>
        <SurveyHeader
          surveyMetadata={surveyMetadata}
          projectMetadata={projectMetadata}
        />
        <VersionToolbar
          projectMetadata={projectMetadata}
          surveyMetadata={surveyMetadata}
          surveyQnasById={surveyQnasById}
          surveyQnaIds={surveyQnaIds}
          upvoteSurvey={upvoteSurvey}
        />
        <Switch>
          <Route
            path={`${this.props.match.path}/issues`}
            render={props => (
              <SurveyIssues
                surveyVersions={surveyMetadata.versions}
                projectSymbol={projectMetadata.symbol}
              />
            )}
          />
          <Route
            path={`${this.props.match.path}/progress`}
            render={() => (
              <SurveyProgress
                surveyMetadata={surveyMetadata}
                projectSymbol={projectMetadata.symbol}
              />
            )}
          />
          <Route
            render={() => (
              <SurveyContent
                parent={this}
                isLoggedIn={isLoggedIn}
                isClosedForComment={isClosedForComment}
                surveyQnasById={surveyQnasById}
                surveyQnaIds={surveyQnaIds}
                numComments={commentIds.length}
                surveyMetadata={surveyMetadata}
                tags={tags}
                tagFilter={tagFilter}
                commentOnClick={this.commentOnClick}
                addNewCommentSentFromServer={addNewCommentSentFromServer}
              />
            )}
          />
        </Switch>
        <SidebarLayout
          width={width}
          selectedComments={selectedComments}
          sidebarOpen={sidebarOpen}
          verificationStatus={verificationStatus}
          toggleSidebar={toggleSidebar}
          updateVerificationStatusInView={updateVerificationStatusInView}
        >
          <CustomScrollbar
            scrollbarContainerWidth={
              this.props.width < 767
                ? "350px"
                : this.props.width > 1300 ? "450px" : "410px"
            }
            scrollbarContainerHeight="calc(100% - 70px)"
            autoHide={true}
            scrollbarThumbColor="rgb(233, 236, 239)"
          >
            <Element
              name="sidebar-contents"
              id="sidebar-contents"
              className="sidebar-contents"
            >
              <SidebarHeader
                commentSortBy={commentSortBy}
                sortCommentBy={sortCommentBy}
                commentIds={commentIds}
                selectedComments={selectedComments}
                tagFilter={tagFilter}
                updateTagFilter={updateTagFilter}
                tagsWithCountInSurvey={tagsWithCountInSurvey}
                isLoggedIn={isLoggedIn}
                isClosedForComment={isClosedForComment}
                resetSelection={this.resetContext}
                commentIssueFilter={commentIssueFilter}
                updateIssueFilter={updateIssueFilter}
                tags={tags}
                surveyMetadata={surveyMetadata}
                addNewComment={addNewComment}
              />
              <SidebarComments
                commentIds={commentIds}
                commentsById={commentsById}
                selectedText={sidebarContext.selectedText}
                selectedComments={selectedComments}
                tags={tags}
                parent={this}
              />
            </Element>
          </CustomScrollbar>
        </SidebarLayout>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({ ...ownProps });

export default connect(mapState, {})(Survey);
