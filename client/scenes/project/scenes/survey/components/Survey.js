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
  SurveyHeader,
  AnnotationSidebar,
  AnnotationItem,
  Question,
  Answers,
  AnnotationSidebarHeader
} from "./index";
import {
  findFirstAnnotationInQna,
  findAnnotationsInQna,
  findAnnotationsInQnaByText
} from "../utils";
import { Scrollbar } from "../../../../../components";
import { Scrollbars } from "react-custom-scrollbars";
import autoBind from "react-autobind";

export default class Survey extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      selectedText: "",
      annotationSelected: false,
      sidebarScrollTo: null,
      mainScrollTo: null
    };
  }

  componentDidMount() {
    const givenAnnotationContext =
      window.location.pathname.indexOf("/annotation/") !== -1;
    const givenQnaContext =
      window.location.pathname.indexOf("/question/") !== -1;
    var annotationId, qnaId, pos;
    if (
      givenAnnotationContext &&
      givenQnaContext &&
      this.props.annotationIds.length
    ) {
      pos = window.location.pathname.indexOf("/annotation/");
      annotationId = window.location.pathname.substring(pos).split("/")[2];
      pos = window.location.pathname.indexOf("/question/");
      qnaId = window.location.pathname.substring(pos).split("/")[2];
      this.setState({
        sidebarScrollTo: `annotation-${annotationId}`,
        mainScrollTo: `qna-${qnaId}`,
        selectedText: this.props.annotationsById[Number(annotationId)].quote,
        annotationSelected: true
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

  resetSelectedText() {
    this.setState({
      selectedText: "",
      annotationSelected: false
    });
  }

  renderSidebar({
    unfilteredAnnotationIds,
    annotationIds,
    annotationsById,
    selectedText
  }) {
    const annotations = findAnnotationsInQnaByText({
      annotationIds: unfilteredAnnotationIds,
      annotationsById,
      text: selectedText
    });
    if (annotationIds && selectedText && annotations && annotations.length) {
      return this.renderSidebarWithSelectedText(annotations);
    }
    if (
      (annotationIds && !selectedText) ||
      (annotationIds &&
        selectedText &&
        (!annotations || (annotations && !annotations.length)))
    ) {
      return this.renderSidebarWithAllAnnotations({
        annotationIds,
        annotationsById,
        selectedText
      });
    }
  }

  renderSidebarWithSelectedText(annotations) {
    return (
      <div>
        {annotations.map(annotation => (
          <AnnotationItem
            key={`annotation-${annotation.id}`}
            annotation={annotation}
          />
        ))}
      </div>
    );
  }

  renderSidebarWithAllAnnotations({
    annotationIds,
    annotationsById,
    selectedText
  }) {
    return annotationIds.map(id => (
      <Element name={`annotation-${id}`}>
        <ScrollLink
          className={`annotation-${id}`}
          activeClass="active"
          to={`qna-${annotationsById[id].survey_question_id}`}
          smooth="easeInOutCubic"
          duration={300}
          spy={true}
        >
          <AnnotationItem
            key={`annotation-${id}`}
            annotation={annotationsById[id]}
            ref={el => (this[`annotation-${id}`] = el)}
          />
        </ScrollLink>
      </Element>
    ));
  }

  handlePollData() {
    this.props.fetchAnnotationsBySurvey(
      `http://localhost:8000${this.props.match.url}`
    );
  }

  annotationOnClick(evt) {
    const selectedText = evt.target.innerHTML;
    const annotations = findAnnotationsInQnaByText({
      annotationIds: this.props.unfilteredAnnotationIds,
      annotationsById: this.props.annotationsById,
      text: selectedText
    });
    if (!this.props.sidebarOpen && annotations.length) {
      this.props.toggleSidebar();
    }
    if (annotations.length) {
      this.setState({
        selectedText,
        annotationSelected: true
      });
    } else {
      this.setState({
        selectedText
      });
    }
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
      width
    } = this.props;

    return (
      <div>
        <div className="project-survey" id="project-survey">
          <SurveyHeader survey={surveyMetadata} project={projectMetadata} />
          {surveyQnaIds.map(id => {
            return (
              <Element name={`qna-${id}`} ref={el => (this[`qna-${id}`] = el)}>
                <Qna
                  key={`qna-${id}`}
                  qna={surveyQnasById[id]}
                  isLoggedIn={isLoggedIn}
                  pollData={this.handlePollData}
                  numAnnotations={annotationIds.length}
                  handleAnnotationOnClick={this.annotationOnClick}
                >
                  <Question question={surveyQnasById[id].question} />
                  <Answers answers={surveyQnasById[id].survey_answers} />
                </Qna>
              </Element>
            );
          })}
        </div>
        <AnnotationSidebar
          width={width}
          annotationSelected={this.state.annotationSelected}
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
                unfilteredAnnotationIds={unfilteredAnnotationIds}
                annotationIds={annotationIds}
                annotationsById={annotationsById}
                selectedText={this.state.selectedText}
                isLoggedIn={isLoggedIn}
                resetSelection={this.resetSelectedText}
                width={width}
              />
              {this.renderSidebar({
                unfilteredAnnotationIds,
                annotationIds,
                annotationsById,
                selectedText: this.state.selectedText
              })}
            </Element>
          </Scrollbar>
        </AnnotationSidebar>
      </div>
    );
  }
}
