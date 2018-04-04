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
import { findFirstAnnotationInQna, findAnnotationsInQna } from "../utils";
import autoBind from "react-autobind";

export default class Survey extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      selectedQna: "",
      editModalOpen: false,
      annotationInModal: {},
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
    if (givenAnnotationContext && givenQnaContext) {
      pos = window.location.pathname.indexOf("/annotation/");
      annotationId = window.location.pathname.substring(pos).split("/")[2];
      pos = window.location.pathname.indexOf("/question/");
      qnaId = window.location.pathname.substring(pos).split("/")[2];
      this.setState({
        sidebarScrollTo: `annotation-${annotationId}`,
        mainScrollTo: `qna-${qnaId}`,
        selectedQna: Number(qnaId)
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

  handleQnaOnClick(qnaId) {
    this.setState({
      selectedQna: qnaId
    });
  }

  resetSelectedQna() {
    this.setState({
      selectedQna: ""
    });
  }

  renderSidebarWithSelectedQna({
    annotationIds,
    annotationsById,
    selectedQna
  }) {
    const annotations = findAnnotationsInQna({
      annotationIds,
      annotationsById,
      survey_question_id: selectedQna
    });
    if (annotationIds && selectedQna && annotations && annotations.length) {
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
  }

  renderSidebarWithAllAnnotations({
    annotationIds,
    annotationsById,
    selectedQna
  }) {
    const annotations = findAnnotationsInQna({
      annotationIds,
      annotationsById,
      survey_question_id: selectedQna
    });
    if (
      (annotationIds && !selectedQna) ||
      (annotationIds &&
        selectedQna &&
        (!annotations || (annotations && !annotations.length)))
    ) {
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
  }

  handleSubmitEditedComment(argObj) {
    this.props.editAnnotationComment(argObj);
    this.closeModal();
  }

  handlePollData() {
    this.props.fetchAnnotationsBySurvey(
      `http://localhost:8000${this.props.match.url}`
    );
  }

  render() {
    const {
      surveyQnasById,
      surveyQnaIds,
      surveyMetadata,
      projectMetadata,
      annotationsById,
      annotationIds,
      isLoggedIn,
      editAnnotationComment,
      match,
      width
    } = this.props;

    return (
      <div>
        <div className="project-survey" id="project-survey">
          <SurveyHeader survey={surveyMetadata} project={projectMetadata} />
          {surveyQnaIds.map(id => {
            const handleQnaOnClick = this.handleQnaOnClick.bind(this, id);
            return (
              <Element
                name={`qna-${id}`}
                onClick={handleQnaOnClick}
                ref={el => (this[`qna-${id}`] = el)}
              >
                <Qna
                  key={`qna-${id}`}
                  qna={surveyQnasById[id]}
                  isLoggedIn={isLoggedIn}
                  pollData={this.handlePollData}
                >
                  <Question question={surveyQnasById[id].question} />
                  <Answers answers={surveyQnasById[id].survey_answers} />
                </Qna>
              </Element>
            );
          })}
        </div>

        <AnnotationSidebar width={width}>
          <Element
            name="annotation-sidebar"
            id="annotation-sidebar"
            className="annotation-contents"
          >
            <AnnotationSidebarHeader
              annotationIds={annotationIds}
              annotationsById={annotationsById}
              selectedQna={this.state.selectedQna}
              isLoggedIn={isLoggedIn}
              resetSelectedQna={this.resetSelectedQna}
            />
            {this.renderSidebarWithAllAnnotations({
              annotationIds,
              annotationsById,
              selectedQna: this.state.selectedQna
            })}
            {this.renderSidebarWithSelectedQna({
              annotationIds,
              annotationsById,
              selectedQna: this.state.selectedQna
            })}
          </Element>
        </AnnotationSidebar>
      </div>
    );
  }
}
