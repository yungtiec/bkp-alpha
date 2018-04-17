import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import AnnotationItem from "../Annotations/AnnotationItem";
import { Link as ScrollLink, Element } from "react-scroll";
import {
  replyToAnnotation,
  initiateReplyToAnnotation,
  cancelReplyToAnnotation,
  upvoteAnnotation,
  verifyAnnotationAsAdmin
} from "../../data/annotations/actions";
import { loadModal } from "../../../../../../data/reducer";
import { notify } from "reapop";

const SidebarAnnotation = props => {
  if (
    props.annotationIds &&
    props.selectedText &&
    props.selectedAnnotations &&
    props.selectedAnnotations.length
  ) {
    return renderSidebarWithSelectedText(props);
  }
  if (
    (props.annotationIds && !props.selectedText) ||
    (props.annotationIds &&
      props.selectedText &&
      (!props.selectedAnnotations ||
        (props.selectedAnnotations && !props.selectedAnnotations.length)))
  ) {
    return renderSidebarWithAllAnnotations(props);
  }
};

function renderSidebarWithSelectedText(props) {
  const {
    selectedAnnotations,
    annotationsById,
    selectedText,
    parent,
    engagementTab,
    replyToAnnotation,
    initiateReplyToAnnotation,
    cancelReplyToAnnotation,
    verifyAnnotationAsAdmin,
    upvoteAnnotation,
    loadModal,
    notify,
    userEmail,
    admin
  } = props;
  return (
    <div>
      {selectedAnnotations
        .filter(a => annotationsById[a.id].reviewed !== "spam")
        .map(annotation => (
          <AnnotationItem
            key={`annotation-${annotation.id}`}
            annotation={annotation}
            ref={el => (parent[`selected-annotation-${annotation.id}`] = el)}
            engagementTab={engagementTab}
            replyToItem={replyToAnnotation}
            initiateReplyToItem={initiateReplyToAnnotation}
            cancelReplyToItem={cancelReplyToAnnotation}
            verifyItemAsAdmin={verifyAnnotationAsAdmin}
            upvoteItem={upvoteAnnotation}
            loadModal={loadModal}
            notify={notify}
            userEmail={userEmail}
            admin={admin}
          />
        ))}
    </div>
  );
}

function renderSidebarWithAllAnnotations(props) {
  const {
    annotationIds,
    annotationsById,
    selectedText,
    parent,
    engagementTab,
    replyToAnnotation,
    initiateReplyToAnnotation,
    cancelReplyToAnnotation,
    verifyAnnotationAsAdmin,
    upvoteAnnotation,
    loadModal,
    notify,
    userEmail,
    admin
  } = props;

  return annotationIds
    .filter(id => annotationsById[id].reviewed !== "spam")
    .map(id => (
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
            ref={el => (parent[`annotation-${id}`] = el)}
            engagementTab={engagementTab}
            replyToItem={replyToAnnotation}
            initiateReplyToItem={initiateReplyToAnnotation}
            cancelReplyToItem={cancelReplyToAnnotation}
            verifyItemAsAdmin={verifyAnnotationAsAdmin}
            upvoteItem={upvoteAnnotation}
            loadModal={loadModal}
            notify={notify}
            userEmail={userEmail}
            admin={admin}
          />
        </ScrollLink>
      </Element>
    ));
}

const mapState = (state, ownProps) => ({
  userEmail: state.data.user.email,
  admin:
    !!state.data.user.roles &&
    state.data.user.roles.filter(r => r.name === "admin").length,
  ...ownProps
});

const actions = {
  replyToAnnotation,
  initiateReplyToAnnotation,
  cancelReplyToAnnotation,
  verifyAnnotationAsAdmin,
  upvoteAnnotation,
  loadModal,
  notify
};

export default connect(mapState, actions)(SidebarAnnotation);
