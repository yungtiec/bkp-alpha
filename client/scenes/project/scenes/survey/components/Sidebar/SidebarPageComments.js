import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { loadModal } from "../../../../../../data/reducer";
import { notify } from "reapop";
import { CommentBoxWithTagField, EngagementItem } from "../index";
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
    changeCommentIssueStatus,
    selectedComment
  } = props;
  if (selectedComment)
    return (
      <EngagementItem
        key={`comment-${selectedComment.id}`}
        engagementItem={selectedComment}
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
    );
  return (
    <div>
      <div className="engagement-item page-comment">
        <div className="engagement-item__main">
          <div className="engagement-item__header">
            <p>Leave a comment?</p>
          </div>
        </div>
        <CommentBoxWithTagField
          showTags={true}
          showIssueCheckbox={true}
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
          <EngagementItem
            key={`comment-${id}`}
            engagementItem={commentsById[id]}
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
