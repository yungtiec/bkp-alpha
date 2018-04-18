import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { loadModal } from "../../../../../../data/reducer";
import { notify } from "reapop";
import { CommentBox, AnnotationItem } from "../index";
import {
  addNewComment,
  initiateReplyToComment,
  cancelReplyToComment,
  replyToComment,
  upvoteComment,
  verifyCommentAsAdmin,
  editComment
} from "../../data/comments/actions";

const SidebarPageComments = props => {
  const {
    commentIds,
    commentsById,
    parent,
    engagementTab,
    loadModal,
    editComment,
    notify,
    userEmail,
    admin,
    addNewComment,
    projectSurveyId,
    initiateReplyToComment,
    cancelReplyToComment,
    replyToComment,
    upvoteComment,
    verifyCommentAsAdmin
  } = props;

  return (
    <div>
      <div className="annotation-item">
        <div className="annotation-item__main">
          <div className="annotation-item__header">
            <p>Leave a comment?</p>
          </div>
        </div>
        <CommentBox
          projectSurveyId={projectSurveyId}
          initialValue=""
          onSubmit={addNewComment}
          onCancel={null}
        />
      </div>
      {commentIds
        .filter(id => commentsById[id].reviewed !== "spam")
        .map(id => (
          <AnnotationItem
            key={`comment-${id}`}
            annotation={commentsById[id]}
            ref={el => (parent[`comment-${id}`] = el)}
            engagementTab={engagementTab}
            replyToItem={replyToComment}
            initiateReplyToItem={initiateReplyToComment}
            cancelReplyToItem={cancelReplyToComment}
            verifyItemAsAdmin={verifyCommentAsAdmin}
            upvoteItem={upvoteComment}
            editItem={editComment}
            loadModal={loadModal}
            notify={notify}
            userEmail={userEmail}
            admin={admin}
          />
        ))}
    </div>
  );
};

const mapState = (state, ownProps) => ({
  userEmail: state.data.user.email,
  admin:
    !!state.data.user.roles &&
    state.data.user.roles.filter(r => r.name === "admin").length,
  ...ownProps
});

const actions = {
  loadModal,
  notify,
  addNewComment,
  initiateReplyToComment,
  cancelReplyToComment,
  replyToComment,
  upvoteComment,
  verifyCommentAsAdmin,
  editComment,
  loadModal
};

export default connect(mapState, actions)(SidebarPageComments);
