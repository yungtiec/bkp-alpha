import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { EngagementItem } from "../index";
import { Link as ScrollLink, Element } from "react-scroll";
import {
  replyToAnnotation,
  initiateReplyToAnnotation,
  cancelReplyToAnnotation,
  upvoteAnnotation,
  verifyAnnotationAsAdmin,
  editAnnotationComment,
  changeAnnotationIssueStatus
} from "../../data/annotations/actions";
import { loadModal } from "../../../../../../data/reducer";
import { notify } from "reapop";

const SidebarAnnotation = props => {
  if (
    props.annotationIds &&
    // props.selectedText &&
    props.selectedAnnotations &&
    props.selectedAnnotations.length
  ) {
    return renderSidebarWithSelectedAnnotations(props);
  }
  if (
    props.annotationIds &&
    (!props.selectedAnnotations ||
      (props.selectedAnnotations && !props.selectedAnnotations.length))
  ) {
    return renderSidebarWithAllAnnotations(props);
  }
};

function renderSidebarWithSelectedAnnotations(props) {
  const {
    selectedAnnotations,
    annotationsById,
    selectedText,
    parent,
    replyToAnnotation,
    initiateReplyToAnnotation,
    cancelReplyToAnnotation,
    verifyAnnotationAsAdmin,
    upvoteAnnotation,
    editAnnotationComment,
    changeAnnotationIssueStatus,
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
          <EngagementItem
            key={`annotation-${annotation.id}`}
            engagementItem={annotation}
            replyToItem={replyToAnnotation}
            initiateReplyToItem={initiateReplyToAnnotation}
            cancelReplyToItem={cancelReplyToAnnotation}
            verifyItemAsAdmin={verifyAnnotationAsAdmin}
            upvoteItem={upvoteAnnotation}
            editItem={editAnnotationComment}
            changeItemIssueStatus={changeAnnotationIssueStatus}
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
    replyToAnnotation,
    initiateReplyToAnnotation,
    cancelReplyToAnnotation,
    verifyAnnotationAsAdmin,
    upvoteAnnotation,
    editAnnotationComment,
    changeAnnotationIssueStatus,
    loadModal,
    notify,
    userEmail,
    admin
  } = props;
  return annotationIds
    .filter(id => annotationsById[id].reviewed !== "spam")
    .map(id => (
      <Element key={`annotation-${id}__element`} name={`annotation-${id}`}>
        <ScrollLink
          key={`annotation-${id}__scrolllink`}
          className={`annotation-${id}`}
          activeClass="active"
          to={`qna-${annotationsById[id].survey_question_id}`}
          smooth="easeInOutCubic"
          duration={300}
          spy={true}
        >
          <EngagementItem
            key={`annotation-${id}`}
            engagementItem={annotationsById[id]}
            replyToItem={replyToAnnotation}
            initiateReplyToItem={initiateReplyToAnnotation}
            cancelReplyToItem={cancelReplyToAnnotation}
            verifyItemAsAdmin={verifyAnnotationAsAdmin}
            upvoteItem={upvoteAnnotation}
            editItem={editAnnotationComment}
            changeItemIssueStatus={changeAnnotationIssueStatus}
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
  editAnnotationComment,
  changeAnnotationIssueStatus,
  loadModal,
  notify
};

export default connect(mapState, actions)(SidebarAnnotation);
