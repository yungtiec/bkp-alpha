import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Link as ScrollLink,
  Element,
  animateScroll as scroll,
  scroller
} from "react-scroll";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Qna,
  SurveyContent,
  Question,
  Answers,
  SidebarLayout,
  SidebarAnnotations,
  SidebarPageComments,
  SidebarHeader
} from "../../components/index";
import { findAnnotationsInQnaByText } from "../../utils";
import { CustomScrollbar } from "../../../../../../components";
import autoBind from "react-autobind";
import { batchActions } from "redux-batched-actions";
import { SquareLoader } from "halogenium";

class Survey extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount(nextProps) {
    this.focusOnContext();
  }

  focusOnContext() {
    const givenAnnotationContext =
      window.location.pathname.indexOf("/annotation/") !== -1;
    const givenQnaContext =
      window.location.pathname.indexOf("/question/") !== -1;
    const givenPageCommentContext =
      window.location.pathname.indexOf("/page-comments") !== -1;
    var annotationId, qnaId, pos, annotations, commentId;
    if (
      givenAnnotationContext &&
      givenQnaContext &&
      !this.props.sidebarContext.focusOnce
    ) {
      pos = window.location.pathname.indexOf("/annotation/");
      annotationId = window.location.pathname.substring(pos).split("/")[2];
      pos = window.location.pathname.indexOf("/question/");
      qnaId = window.location.pathname.substring(pos).split("/")[2];
      if (this.props.annotationsById[Number(annotationId)]) {
        scroller.scrollTo(`qna-${qnaId}`);
        batchActions([
          this.props.updateEngagementTabInView("annotations"),
          this.props.updateSidebarContext({
            selectedAnnotationId: Number(annotationId),
            focusOnce: true
          })
        ]);
      }
    } else if (
      givenPageCommentContext &&
      !this.props.sidebarContext.focusOnce
    ) {
      pos = window.location.pathname.indexOf("/page-comments/");
      commentId = window.location.pathname.substring(pos).split("/")[2];
      batchActions([
        this.props.updateEngagementTabInView("comments"),
        this.props.updateSidebarContext({
          selectedCommentId: commentId,
          focusOnce: true
        })
      ]);
    }
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
      this.resetSidebarContext();
    }
  }

  componentWillUnmount() {
    this.resetSidebarContext();
  }

  resetSidebarContext() {
    batchActions([
      this.props.updateEngagementTabInView("annotations"),
      this.props.updateSidebarContext({
        selectedText: "",
        selectedAnnotations: null,
        focusOnce: false,
        selectedCommentId: "",
        selectedAnnotationId: null
      })
    ]);
  }

  annotationOnClick(evt, qnaId, answerId) {
    const selectedTextByUser = window.getSelection
      ? "" + window.getSelection()
      : document.selection.createRange().text;
    if (selectedTextByUser) return;
    if (!qnaId && !answerId) return;
    const selectedText = evt.target.innerHTML;
    const annotations = findAnnotationsInQnaByText({
      annotationIds: this.props.unfilteredAnnotationIds,
      annotationsById: this.props.annotationsById,
      text: selectedText,
      qnaId
    });
    if (!this.props.sidebarOpen && annotations && annotations.length) {
      this.props.toggleSidebar();
    }
    if (
      !this.props.engagementTab !== "annotations" &&
      annotations &&
      annotations.length
    ) {
      this.props.updateEngagementTabInView("annotations");
    }
    if (annotations && annotations.length) {
      this.props.updateSidebarContext({
        focusQnaId: qnaId,
        selectedText
      });
    } else {
      this.props.updateSidebarContext({
        focusQnaId: qnaId,
        selectedText
      });
    }
  }

  getSelectedAnnotations() {
    const {
      sidebarContext,
      unfilteredAnnotationIds,
      annotationsById
    } = this.props;
    if (sidebarContext.selectedText)
      return findAnnotationsInQnaByText({
        annotationIds: unfilteredAnnotationIds,
        annotationsById: annotationsById,
        text: sidebarContext.selectedText,
        qnaId: sidebarContext.focusQnaId
      });
    else if (
      sidebarContext.selectedAnnotationId &&
      annotationsById[sidebarContext.selectedAnnotationId]
    )
      return [annotationsById[sidebarContext.selectedAnnotationId]];
    else return [];
  }

  resetContext() {
    this.props.updateSidebarContext({
      selectedText: "",
      focusQnaId: "",
      selectedCommentId: "",
      selectedAnnotationId: ""
    });
  }

  render() {
    const {
      surveyQnasById,
      surveyQnaIds,
      surveyMetadata,
      projectMetadata,
      annotationsById,
      annotationIds,
      unfilteredAnnotationIds,
      isLoggedIn,
      match,
      width,
      annotationSortBy,
      engagementTab,
      sortAnnotationBy,
      tags,
      tagsWithCountInSurvey,
      tagFilter,
      updateTagFilter,
      addNewAnnotationSentFromServer,
      updateEngagementTabInView,
      commentSortBy,
      sortCommentBy,
      commentIds,
      commentsById,
      projectSurveyId,
      sidebarContext,
      annotationIssueFilter,
      commentIssueFilter,
      updateIssueFilter
    } = this.props;
    const selectedAnnotations = this.getSelectedAnnotations();
    const selectedComment = commentsById[sidebarContext.selectedCommentId];
    return (
      <div>
        <SurveyContent
          parent={this}
          isLoggedIn={isLoggedIn}
          surveyQnasById={surveyQnasById}
          surveyQnaIds={surveyQnaIds}
          numAnnotations={annotationIds.length}
          surveyMetadata={surveyMetadata}
          projectMetadata={projectMetadata}
          tags={tags}
          tagFilter={tagFilter}
          annotationOnClick={this.annotationOnClick}
          addNewAnnotationSentFromServer={addNewAnnotationSentFromServer}
        />
        <SidebarLayout width={width} selectedAnnotations={selectedAnnotations}>
          <CustomScrollbar
            scrollbarContainerWidth={
              this.props.width < 767
                ? "350px"
                : this.props.width > 1300 ? "450px" : "410px"
            }
            scrollbarContainerHeight="calc(100% - 120px)"
            autoHide={true}
            scrollbarThumbColor="rgb(233, 236, 239)"
          >
            <Element
              name="sidebar-contents"
              id="sidebar-contents"
              className="sidebar-contents"
            >
              <SidebarHeader
                engagementTab={engagementTab}
                updateEngagementTabInView={updateEngagementTabInView}
                annotationSortBy={annotationSortBy}
                sortAnnotationBy={sortAnnotationBy}
                annotationIds={annotationIds}
                selectedAnnotations={selectedAnnotations}
                commentSortBy={commentSortBy}
                sortCommentBy={sortCommentBy}
                commentIds={commentIds}
                tagFilter={tagFilter}
                updateTagFilter={updateTagFilter}
                tagsWithCountInSurvey={tagsWithCountInSurvey}
                isLoggedIn={isLoggedIn}
                resetSelection={this.resetContext}
                selectedComment={selectedComment}
                annotationIssueFilter={annotationIssueFilter}
                commentIssueFilter={commentIssueFilter}
                updateIssueFilter={updateIssueFilter}
              />
              {engagementTab === "annotations" && (
                <SidebarAnnotations
                  engagementTab={engagementTab}
                  annotationIds={annotationIds}
                  annotationsById={annotationsById}
                  selectedText={sidebarContext.selectedText}
                  selectedAnnotations={selectedAnnotations}
                  parent={this}
                />
              )}
              {engagementTab === "comments" && (
                <SidebarPageComments
                  projectSurveyId={projectSurveyId}
                  engagementTab={engagementTab}
                  commentIds={commentIds}
                  commentsById={commentsById}
                  selectedComment={selectedComment}
                  parent={this}
                  tags={tags}
                />
              )}
            </Element>
          </CustomScrollbar>
        </SidebarLayout>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({ ...ownProps });

export default connect(mapState, {})(Survey);
