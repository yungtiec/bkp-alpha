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
  AnnotationSidebar,
  AnnotationItem,
  Question,
  Answers,
  AnnotationSidebarContent,
  AnnotationSidebarHeader
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
        annotations = findAnnotationsInQnaByText({
          annotationIds: this.props.unfilteredAnnotationIds,
          annotationsById: this.props.annotationsById,
          text: this.props.annotationsById[Number(annotationId)].quote,
          qnaId: Number(qnaId)
        });
        scroller.scrollTo(`qna-${qnaId}`);
        this.setState({
          selectedText: this.props.annotationsById[Number(annotationId)].quote,
          selectedAnnotations: annotations,
          focusOnce: true
        });
      }
    }
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
    if (annotations && annotations.length) {
      this.setState({
        selectedText,
        selectedAnnotations: annotations
      });
    } else {
      this.setState({
        selectedText,
        selectedAnnotations: null
      });
    }
  }

  resetSelectedText() {
    this.setState({
      selectedText: "",
      selectedAnnotations: null
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
      sortBy,
      sortAnnotationBy,
      tags,
      tagsWithCountInSurvey,
      tagFilter,
      updateTagFilter,
      addNewAnnotationSentFromServer
    } = this.props;

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
          tagFilter={tagFilter}
          annotationOnClick={this.annotationOnClick}
          addNewAnnotationSentFromServer={addNewAnnotationSentFromServer}
        />
        <AnnotationSidebar
          width={width}
          selectedAnnotations={this.state.selectedAnnotations}
        >
          <CustomScrollbar
            scrollbarContainerWidth={this.props.width < 767 ? "350px" : "410px"}
            scrollbarContainerHeight="calc(100% - 120px)"
            autoHide={true}
            scrollbarThumbColor="rgb(233, 236, 239)"
          >
            <Element
              name="annotation-sidebar"
              id="annotation-sidebar"
              className="annotation-contents"
            >
              <AnnotationSidebarHeader
                sortBy={sortBy}
                sortAnnotationBy={sortAnnotationBy}
                annotationIds={annotationIds}
                selectedAnnotations={this.state.selectedAnnotations}
                tagFilter={tagFilter}
                updateTagFilter={updateTagFilter}
                tagsWithCountInSurvey={tagsWithCountInSurvey}
                isLoggedIn={isLoggedIn}
                resetSelection={this.resetSelectedText}
              />
              <AnnotationSidebarContent
                annotationIds={annotationIds}
                annotationsById={annotationsById}
                selectedText={this.state.selectedText}
                selectedAnnotations={this.state.selectedAnnotations}
                parent={this}
              />
            </Element>
          </CustomScrollbar>
        </AnnotationSidebar>
      </div>
    );
  }
}
