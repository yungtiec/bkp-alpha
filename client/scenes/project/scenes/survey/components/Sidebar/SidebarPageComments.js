import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { loadModal } from "../../../../../../data/reducer";
import { notify } from "reapop";
import { CommentBoxWithTagField, AnnotationItem } from "../index";
import {
  addNewComment,
  initiateReplyToComment,
  cancelReplyToComment,
  replyToComment,
  upvoteComment,
  verifyCommentAsAdmin,
  changeCommentIssueStatus,
  editComment
} from "../../data/comments/actions";

const SidebarPageComments = props => {
  const {
    tags,
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
    verifyCommentAsAdmin,
    changeCommentIssueStatus
  } = props;

  return (
    <div>
      <div className="annotation-item page-comment">
        <div className="annotation-item__main">
          <div className="annotation-item__header">
            <p>Leave a comment?</p>
          </div>
        </div>
        <CommentBoxWithTagField
          tags={tags}
          selectedTags={[]}
          initialValue=""
          projectSurveyId={projectSurveyId}
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
            changeItemIssueStatus={changeCommentIssueStatus}
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
  changeCommentIssueStatus,
  loadModal
};

export default connect(mapState, actions)(SidebarPageComments);
