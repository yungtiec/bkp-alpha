import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Link as ScrollLink,
  Element,
  animateScroll as scroll
} from "react-scroll";
import {
  Qna,
  SurveyHeader,
  AnnotationSidebar,
  AnnotationItem,
  Question,
  Answers,
  CommentBox
} from "./index";
import { findFirstAnnotationInQna, findAnnotationsInQna } from "../utils";
import Modal from "react-modal";
import autoBind from "react-autobind";

export default class Survey extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      selectedQna: "",
      editModalOpen: false,
      annotationInModal: {}
    };
  }

  openModal(annotationInModal) {
    this.setState({ modalIsOpen: true, annotationInModal });
  }

  closeModal() {
    this.setState({ modalIsOpen: false, annotationInModal: {} });
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

  renderHeader({ annotationIds, annotationsById, selectedQna }) {
    const annotations = findAnnotationsInQna({
      annotationIds,
      annotationsById,
      survey_question_id: selectedQna
    });
    if (annotationIds && selectedQna && annotations.length) {
      return (
        <p
          className="annotations-header reset-selection"
          onClick={this.resetSelectedQna}
        >
          Show all Annotation ({annotationIds.length})
        </p>
      );
    } else if (
      (annotationIds && !selectedQna) ||
      (annotationIds && selectedQna && !annotations.length)
    ) {
      return (
        <p className="annotations-header">
          Annotation ({annotationIds.length})
        </p>
      );
    } else {
      return <p className="annotations-header">Annotation</p>;
    }
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
    if (annotationIds && selectedQna && annotations.length) {
      return (
        <div>
          {annotations.map(annotation => (
            <AnnotationItem
              key={`annotation-${annotation.id}`}
              annotation={annotation}
              openModal={this.openModal}
              closeModal={this.closeModal}
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
      (annotationIds && selectedQna && !annotations.length)
    ) {
      return annotationIds.map(id => (
        <ScrollLink
          className={`annotation-${id}`}
          activeClass="active"
          to={`qna-${annotationsById[id].survey_question_id}`}
          smooth="easeInOutCubic"
          duration={300}
          spy={true}
        >
          <Element name={`annotation-${id}`}>
            <AnnotationItem
              key={`annotation-${id}`}
              annotation={annotationsById[id]}
              ref={el => (this[`annotation-${id}`] = el)}
              openModal={this.openModal}
              closeModal={this.closeModal}
            />
          </Element>
        </ScrollLink>
      ));
    }
  }

  handleSubmitEditedComment(argObj) {
    this.props.editAnnotationComment(argObj)
    this.closeModal()
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
      editAnnotationComment
    } = this.props;
    return (
      <div>
        <div className="project-survey" id="project-survey">
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            contentLabel="Example Modal"
          >
            <div className="annotation-item__edit">
              <p className="annotation-item__quote">
                {this.state.annotationInModal.quote}
              </p>
              <CommentBox
                initialValue={this.state.annotationInModal.comment}
                annotationId={this.state.annotationInModal.id}
                onSubmit={this.handleSubmitEditedComment}
                onCancel={this.closeModal}
              />
              <div className="annotation-item__action--bottom " />
            </div>
          </Modal>
          <SurveyHeader survey={surveyMetadata} project={projectMetadata} />
          {surveyQnaIds.map(id => {
            const handleQnaOnClick = this.handleQnaOnClick.bind(this, id);
            return (
              <Element name={`qna-${id}`} onClick={handleQnaOnClick}>
                <Qna
                  key={`qna-${id}`}
                  qna={surveyQnasById[id]}
                  isLoggedIn={isLoggedIn}
                  ref={el => (this[`qna-${id}`] = el)}
                >
                  <Question question={surveyQnasById[id].question} />
                  <Answers answers={surveyQnasById[id].survey_answers} />
                </Qna>
              </Element>
            );
          })}
        </div>

        <AnnotationSidebar>
          <Element
            name="annotation-sidebar"
            id="annotation-sidebar"
            className="annotation-contents"
          >
            <div className="annotation-sidebar__logo-consensys">
              <img
                width="100px"
                height="auto"
                className="logo__large"
                src="/assets/consensys-logo-white-transparent.png"
              />
            </div>
            <div className="annotation-sidebar__logo-tbp">
              <img
                width="120px"
                height="auto"
                className="logo__large"
                src="/assets/the-brooklyn-project-logo-white-transparent.png"
              />
            </div>
            {this.renderHeader({
              annotationIds,
              annotationsById,
              selectedQna: this.state.selectedQna
            })}
            {!isLoggedIn && (
              <div className="annotation-item">
                <div className="annotation-item__main">
                  <div className="annotation-item__header">
                    <p>
                      <Link to="/login">Login</Link> or{" "}
                      <Link to="/signup">signup</Link> to create an annotation
                    </p>
                  </div>
                </div>
              </div>
            )}
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
