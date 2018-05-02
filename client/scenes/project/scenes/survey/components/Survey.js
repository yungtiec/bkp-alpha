import "./annotator.scss";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Link as ScrollLink,
  Element,
  animateScroll as scroll,
  scroller
} from "react-scroll";
import {
  Qna,
  SurveyBody,
  AnnotationItem,
  Question,
  Answers,
  SidebarLayout,
  SidebarAnnotations,
  SidebarPageComments,
  SidebarHeader
} from "./index";
import { findAnnotationsInQnaByText } from "../utils";
import { CustomScrollbar } from "../../../../../components";
import autoBind from "react-autobind";

export default class Survey extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      selectedText: "",
      selectedAnnotations: null,
      focusOnce: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.focusOnContext();
  }

  focusOnContext() {
    const givenAnnotationContext =
      window.location.pathname.indexOf("/annotation/") !== -1;
    const givenQnaContext =
      window.location.pathname.indexOf("/question/") !== -1;
    const givenPageCommentContext =
      window.location.pathname.indexOf("/page-comments") !== -1;
    var annotationId, qnaId, pos, annotations;
    if (
      givenAnnotationContext &&
      givenQnaContext &&
      this.props.annotationIds.length &&
      this.props.surveyQnaIds.length &&
      !this.state.focusOnce
    ) {
      pos = window.location.pathname.indexOf("/annotation/");
      annotationId = window.location.pathname.substring(pos).split("/")[2];
      pos = window.location.pathname.indexOf("/question/");
      qnaId = window.location.pathname.substring(pos).split("/")[2];
      if (this.props.annotationsById[Number(annotationId)]) {
        scroller.scrollTo(`qna-${qnaId}`);
        this.setState({
          selectedText: this.props.annotationsById[Number(annotationId)].quote,
          focusQnaId: Number(qnaId),
          focusOnce: true
        });
      }
    } else if (
      givenPageCommentContext &&
      this.props.annotationIds.length &&
      this.props.surveyQnaIds.length &&
      !this.state.focusOnce
    ) {
      this.props.updateEngagementTabInView("comments");
      this.setState({
        focusOnce: true
      });
    }
  }

  componentWillUnmount() {
    this.props.updateEngagementTabInView("annotations");
    this.setState({
      selectedText: "",
      selectedAnnotations: null,
      focusOnce: false
    });
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
      this.setState({
        focusQnaId: qnaId,
        selectedText
      });
    } else {
      this.setState({
        focusQnaId: qnaId,
        selectedText
      });
    }
  }

  resetSelectedText() {
    this.setState({
      selectedText: "",
      focusQnaId: ""
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
      projectSurveyId
    } = this.props;
    const selectedAnnotations = findAnnotationsInQnaByText({
      annotationIds: unfilteredAnnotationIds,
      annotationsById: annotationsById,
      text: this.state.selectedText,
      qnaId: this.state.focusQnaId
    });
    return (
      <div>
        <SurveyBody
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
            scrollbarContainerWidth={this.props.width < 767 ? "350px" : "410px"}
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
                resetSelection={this.resetSelectedText}
              />
              {engagementTab === "annotations" && (
                <SidebarAnnotations
                  engagementTab={engagementTab}
                  annotationIds={annotationIds}
                  annotationsById={annotationsById}
                  selectedText={this.state.selectedText}
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
