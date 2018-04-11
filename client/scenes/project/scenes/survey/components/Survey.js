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
import { Scrollbar } from "../../../../../components";
import autoBind from "react-autobind";

export default class Survey extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      selectedText: "",
      selectedAnnotations: null,
      selectedDomNode: null,
      sidebarScrollTo: null,
      mainScrollTo: null
    };
  }

  componentDidMount() {
    const givenAnnotationContext =
      window.location.pathname.indexOf("/annotation/") !== -1;
    const givenQnaContext =
      window.location.pathname.indexOf("/question/") !== -1;
    var annotationId, qnaId, pos, annotations;
    if (
      givenAnnotationContext &&
      givenQnaContext &&
      this.props.annotationIds.length
    ) {
      pos = window.location.pathname.indexOf("/annotation/");
      annotationId = window.location.pathname.substring(pos).split("/")[2];
      pos = window.location.pathname.indexOf("/question/");
      qnaId = window.location.pathname.substring(pos).split("/")[2];
      annotations = findAnnotationsInQnaByText({
        annotationIds: this.props.unfilteredAnnotationIds,
        annotationsById: this.props.annotationsById,
        text: this.props.annotationsById[Number(annotationId)].quote, // what if it's a reply!!, need to find its parend...
        qnaId: Number(qnaId)
      });
      this.setState({
        sidebarScrollTo: `annotation-${annotationId}`,
        mainScrollTo: `qna-${qnaId}`,
        selectedText: this.props.annotationsById[Number(annotationId)].quote,
        selectedAnnotations: annotations
      });
    }
  }

  componentDidUpdate() {
    if (this.state.sidebarScrollTo && this.state.mainScrollTo) {
      scroller.scrollTo(this.state.mainScrollTo);
      this.setState({
        sidebarScrollTo: null,
        mainScrollTo: null
      });
    }
  }

  handlePollData() {
    this.props.fetchAnnotationsBySurvey(
      `http://localhost:8000${this.props.match.url}`
    );
  }

  annotationOnClick(evt, qnaId, answerId) {
    const selectedTextByUser = window.getSelection
      ? "" + window.getSelection()
      : document.selection.createRange().text;
    if (selectedTextByUser) return;
    if (!qnaId && !answerId) return;
    this.resetHighlightColor(this.state.selectedDomNode);
    const selectedText = evt.target.innerHTML;
    const annotations = findAnnotationsInQnaByText({
      annotationIds: this.props.unfilteredAnnotationIds,
      annotationsById: this.props.annotationsById,
      text: selectedText,
      qnaId
    });
    if (!this.props.sidebarOpen && annotations.length) {
      this.props.toggleSidebar();
    }
    if (annotations.length) {
      this.changeHighlightColor(evt.target);
      this.setState({
        selectedText,
        selectedAnnotations: annotations,
        selectedDomNode: evt.target
      });
    } else {
      this.setState({
        selectedText,
        selectedAnnotations: null
      });
    }
  }

  changeHighlightColor(targetNode) {
    const annotationInSelectedOne = targetNode.getElementsByClassName(
      "annotator-hl"
    );
    const annotationParent = targetNode.parentElement;
    annotationParent.classList.contains("annotator-hl") &&
      annotationParent.classList.add("annotation-selected");
    annotationInSelectedOne.length > 1 &&
      annotationInSelectedOne.forEach(el => {
        el.classList.add("annotation-selected");
      });
    annotationInSelectedOne.length === 1 &&
      annotationInSelectedOne[0].classList.add("annotation-selected");
    targetNode.classList.add("annotation-selected");
  }

  resetHighlightColor(targetNode) {
    if (!targetNode) return;
    const annotationInSelectedOne = targetNode.getElementsByClassName(
      "annotator-hl"
    );
    const annotationParent = targetNode.parentElement;
    annotationParent.classList.contains("annotator-hl") &&
      annotationParent.classList.remove("annotation-selected");
    console.log(annotationInSelectedOne)
    annotationInSelectedOne.length > 1 &&
      annotationInSelectedOne.forEach(el => {
        el.classList.remove("annotation-selected");
      });
    annotationInSelectedOne.length === 1 &&
      annotationInSelectedOne[0].classList.remove("annotation-selected");
    targetNode.classList.remove("annotation-selected");
  }

  resetSelectedText() {
    this.resetHighlightColor(this.state.selectedDomNode);
    this.setState({
      selectedText: "",
      selectedAnnotations: null,
      selectedDomNode: null
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
      tags
    } = this.props;

    console.log(tags, 'in survey')

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
          annotationOnClick={this.annotationOnClick}
          handlePollData={this.handlePollData}
        />
        <AnnotationSidebar
          width={width}
          selectedAnnotations={this.state.selectedAnnotations}
        >
          <Scrollbar
            containerWidth={this.props.width < 767 ? "350px" : "410px"}
            containerHeight="calc(100% - 120px)"
            autoHide={true}
            thumbColor="rgb(233, 236, 239)"
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
          </Scrollbar>
        </AnnotationSidebar>
      </div>
    );
  }
}
