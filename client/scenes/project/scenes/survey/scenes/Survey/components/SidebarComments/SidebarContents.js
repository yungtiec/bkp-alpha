import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { CommentItem } from "../../../../components";
import { Link as ScrollLink, Element } from "react-scroll";
import {
  replyToComment,
  initiateReplyToComment,
  cancelReplyToComment,
  upvoteComment,
  verifyCommentAsAdmin,
  editComment,
  changeCommentIssueStatus
} from "../../../../data/comments/actions";
import { loadModal } from "../../../../../../data/reducer";
import { notify } from "reapop";

const SidebarContents = props => {
  if (
    props.commentIds &&
    // props.selectedText &&
    props.selectedComments &&
    props.selectedComments.length
  ) {
    return renderSidebarWithSelectedComments(props);
  }
  if (
    props.commentIds &&
    (!props.selectedComments ||
      (props.selectedComments && !props.selectedComments.length))
  ) {
    return renderSidebarWithAllComments(props);
  }
};

function renderSidebarWithSelectedComments(props) {
  const {
    selectedComments,
    commentsById,
    selectedText,
    parent,
    replyToComment,
    initiateReplyToComment,
    cancelReplyToComment,
    verifyCommentAsAdmin,
    upvoteComment,
    editComment,
    changeCommentIssueStatus,
    loadModal,
    notify,
    userEmail,
    admin
  } = props;
  return (
    <div>
      {selectedComments
        .filter(a => commentsById[a.id].reviewed !== "spam")
        .map(comment => (
          <CommentItem
            key={`comment-${comment.id}`}
            comment={comment}
            replyToItem={replyToComment}
            initiateReplyToItem={initiateReplyToComment}
            cancelReplyToItem={cancelReplyToComment}
            verifyItemAsAdmin={verifyCommentAsAdmin}
            upvoteItem={upvoteComment}
            editItem={editComment}
            changeItemIssueStatus={changeCommentIssueStatus}
            loadModal={loadModal}
            notify={notify}
            userEmail={userEmail}
          />
        ))}
    </div>
  );
}

function renderSidebarWithAllComments(props) {
  const {
    commentIds,
    commentsById,
    selectedText,
    parent,
    replyToComment,
    initiateReplyToComment,
    cancelReplyToComment,
    verifyCommentAsAdmin,
    upvoteComment,
    editComment,
    changeCommentIssueStatus,
    loadModal,
    notify,
    userEmail,
    admin
  } = props;
  return commentIds
    .filter(id => commentsById[id].reviewed !== "spam")
    .map(id => (
      <Element key={`comment-${id}__element`} name={`comment-${id}`}>
        <ScrollLink
          key={`comment-${id}__scrolllink`}
          className={`comment-${id}`}
          activeClass="active"
          to={`qna-${commentsById[id].survey_question_id}`}
          smooth="easeInOutCubic"
          duration={300}
          spy={true}
        >
          <CommentItem
            key={`comment-${id}`}
            comment={commentsById[id]}
            replyToItem={replyToComment}
            initiateReplyToItem={initiateReplyToComment}
            cancelReplyToItem={cancelReplyToComment}
            verifyItemAsAdmin={verifyCommentAsAdmin}
            upvoteItem={upvoteComment}
            editItem={editComment}
            changeItemIssueStatus={changeCommentIssueStatus}
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
  replyToComment,
  initiateReplyToComment,
  cancelReplyToComment,
  verifyCommentAsAdmin,
  upvoteComment,
  editComment,
  changeCommentIssueStatus,
  loadModal,
  notify
};

export default connect(mapState, actions)(SidebarContents);
