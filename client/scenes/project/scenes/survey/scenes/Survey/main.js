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
import {
  SurveyContent,
  SurveyProgress,
  SurveyIssues,
  SidebarComments,
  SidebarTableOfContents
} from "./components";
import { SurveyHeader, VersionToolbar } from "../../components";
import { findCommentsInQnaByText } from "../../utils";
import { SidebarLayout, CustomScrollbar } from "../../../../../../components";
import Joyride from "react-joyride";

class Survey extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      run: this.props.isLoggedIn && !this.props.onboard,
      steps: [
        {
          target: "div.qna__answer p:first-of-type",
          content: "Select text from document to make an annotation.",
          disableBeacon: true,
          placement: "top"
        },
        {
          target: ".page-comment",
          content: "Tell us what you think about the framework.",
          disableBeacon: true,
          placement: "left"
        },
        {
          target: ".page-comment",
          content: (
            <div>
              Wish to comment anonymity? Change your default setting in profile
              page.
            </div>
          ),
          disableBeacon: true,
          placement: "left"
        }
      ]
    };
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
        this.props.updateSidebarCommentContext({
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
    this.props.updateSidebarCommentContext({
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
      this.props.updateSidebarCommentContext({
        focusQnaId: qnaId,
        selectedText
      });
    }
  }

  getSelectedComments() {
    const {
      sidebarCommentContext,
      unfilteredCommentIds,
      commentsById
    } = this.props;
    if (sidebarCommentContext.selectedText)
      return findCommentsInQnaByText({
        commentIds: unfilteredCommentIds,
        commentsById: commentsById,
        text: sidebarCommentContext.selectedText,
        qnaId: sidebarCommentContext.focusQnaId
      });
    else if (
      sidebarCommentContext.selectedCommentId &&
      commentsById[sidebarCommentContext.selectedCommentId]
    )
      return [commentsById[sidebarCommentContext.selectedCommentId]];
    else return [];
  }

  resetSidebarCommentContext() {
    this.props.updateSidebarCommentContext({
      selectedText: "",
      focusQnaId: "",
      selectedCommentId: ""
    });
  }

  handleJoyrideCallback(data) {
    if (data.status === "finished") {
      this.props.updateOnboardStatus();
    }
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
      anonymity,
      isClosedForComment,
      match,
      width,
      commentSortBy,
      sortCommentBy,
      tags,
      tagsWithCountInSurvey,
      tagFilter,
      updateTagFilter,
      addNewCommentSentFromServer,
      sidebarCommentContext,
      commentIssueFilter,
      updateIssueFilter,
      addNewComment,
      sidebarOpen,
      sidebarContext,
      annotationHighlight,
      toggleSidebar,
      toggleSidebarContext,
      upvoteProjectSurvey,
      downvoteProjectSurvey
    } = this.props;

    const selectedComments = this.getSelectedComments();

    return (
      <div>
        <Joyride
          continuous
          showProgress
          steps={this.state.steps}
          run={this.state.run}
          callback={this.handleJoyrideCallback}
          styles={{
            options: {
              primaryColor: "#2540ce"
            }
          }}
        />
        <SurveyHeader
          surveyMetadata={surveyMetadata}
          projectMetadata={projectMetadata}
        />
        {isLoggedIn && (
          <VersionToolbar
            projectMetadata={projectMetadata}
            surveyMetadata={surveyMetadata}
            surveyQnasById={surveyQnasById}
            surveyQnaIds={surveyQnaIds}
            upvoteProjectSurvey={upvoteProjectSurvey}
            downvoteProjectSurvey={downvoteProjectSurvey}
          />
        )}
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
          toggleSidebar={toggleSidebar}
          sidebarContext={sidebarContext}
          toggleSidebarContext={toggleSidebarContext}
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
            {sidebarContext === "comments" && (
              <SidebarComments
                isLoggedIn={isLoggedIn}
                anonymity={anonymity}
                commentIds={commentIds}
                commentsById={commentsById}
                surveyMetadata={surveyMetadata}
                commentSortBy={commentSortBy}
                sortCommentBy={sortCommentBy}
                tags={tags}
                tagFilter={tagFilter}
                updateTagFilter={updateTagFilter}
                tagsWithCountInSurvey={tagsWithCountInSurvey}
                commentIssueFilter={commentIssueFilter}
                updateIssueFilter={updateIssueFilter}
                isClosedForComment={isClosedForComment}
                addNewComment={addNewComment}
                selectedComments={selectedComments}
                selectedText={sidebarCommentContext.selectedText}
                resetCommentSelection={this.resetSidebarCommentContext}
                parent={this}
              />
            )}
            {sidebarContext === "tableOfContents" && (
              <SidebarTableOfContents
                surveyQnasById={surveyQnasById}
                surveyQnaIds={surveyQnaIds}
              />
            )}
          </CustomScrollbar>
        </SidebarLayout>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({ ...ownProps });

export default connect(mapState, {})(Survey);
