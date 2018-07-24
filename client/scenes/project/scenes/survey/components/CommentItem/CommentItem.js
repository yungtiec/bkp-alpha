import "./CommentItem.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { Link } from "react-router-dom";
import moment from "moment";
import { cloneDeep, isEmpty, find, orderBy, assignIn } from "lodash";
import { CommentBox } from "../index";
import ActionBar from "./ActionBar";
import ActionableIssueTag from "./ActionableIssueTag";

export default class CommentItem extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      isCommenting: false,
      replyTarget: null,
      showReplies: false
    };
  }

  render() {
    const { comment } = this.props;

    return (
      <div className="comment-item">
        {this.renderMainComment(comment)}
        {this.state.showReplies && (
          <p
            className="my-3 comment-item__collapse-btn"
            onClick={this.toggleShowReplies}
          >
            - Collapse replies
          </p>
        )}
        {comment.descendents.length < 3 || this.state.showReplies ? (
          <div className="ml-3">
            {this.renderReplies(comment.descendents, comment.id)}
          </div>
        ) : (
          <p className="my-3" onClick={this.toggleShowReplies}>
            + View {comment.descendents.length} replies
          </p>
        )}
        {this.state.isCommenting ? (
          <div>
            {this.state.replyTarget && (
              <span className="ml-1">{`replying to ${
                this.state.replyTarget.owner.displayName
              }`}</span>
            )}
            <CommentBox
              rootId={comment.id}
              parentId={
                this.state.replyTarget ? this.state.replyTarget.id : comment.id
              }
              projectSurveyId={comment.project_survey_id}
              onSubmit={this.props.replyToItem}
              onCancel={this.hideCommentBox}
            />
          </div>
        ) : null}
      </div>
    );
  }

  initReply(replyTarget) {
    this.setState({
      isCommenting: true,
      replyTarget
    });
  }

  hideCommentBox(accessors, parent) {
    this.setState({
      isCommenting: false,
      parentId: null
    });
  }

  openModal(comment, showIssueCheckbox, showTags) {
    this.props.loadModal("EDIT_COMMENT_MODAL", {
      ...comment,
      showIssueCheckbox,
      showTags,
      editItem: this.props.editItem
    });
  }

  promptLoginToast() {
    this.props.notify({
      title: "",
      message: "Login required",
      status: "error",
      dismissible: true,
      dismissAfter: 3000
    });
  }

  labelAsNotSpam(comment, rootId) {
    this.props.verifyItemAsAdmin({
      comment,
      rootId,
      reviewed: "verified"
    });
  }

  labelAsSpam(comment, rootId) {
    this.props.verifyItemAsAdmin({ comment, rootId, reviewed: "spam" });
  }

  toggleShowReplies() {
    this.setState(prevState => ({
      showReplies: !prevState.showReplies
    }));
  }

  renderMainComment(comment) {
    const hasUpvoted = find(
      comment.upvotesFrom,
      upvotedUser => upvotedUser.id === this.props.user.id
    );
    const initReplyToThis = this.props.isLoggedIn
      ? this.initReply.bind(this, null)
      : this.promptLoginToast;
    const upvoteItem = this.props.isLoggedIn
      ? this.props.upvoteItem.bind(this, {
          rootId: null,
          comment,
          hasUpvoted
        })
      : this.promptLoginToast;
    const openModal = this.openModal.bind(null, comment, true, true);
    const changeItemIssueStatus = this.props.changeItemIssueStatus.bind(
      null,
      comment
    );
    return (
      <div
        className="comment-item__main"
        style={comment.descendents.length ? { borderBottom: "1px solid" } : {}}
      >
        <div className="comment-item__header">
          <p className="comment-item__owner-name">{comment.owner.displayName}</p>
          <p>{moment(comment.createdAt).fromNow()}</p>
        </div>
        {comment.quote && (
          <p className="comment-item__quote">{comment.quote}</p>
        )}
        {(comment.tags && comment.tags.length) || comment.issue ? (
          <div className="comment-item__tags">
            <ActionableIssueTag
              comment={comment}
              changeItemIssueStatus={changeItemIssueStatus}
            />
            {comment.tags && comment.tags.length
              ? comment.tags.map(tag => (
                  <span
                    key={`comment-${comment.id}__tag-${tag.name}`}
                    className="badge badge-light"
                  >
                    {tag.name}
                    {"  "}
                  </span>
                ))
              : ""}
          </div>
        ) : null}
        <p className="comment-item__comment">{comment.comment}</p>
        {comment.issue && comment.issue.resolvingProjectSurvey ? (
          <span className="comment-item__issue-resolved">
            <Link
              to={`/project/${
                comment.issue.resolvingProjectSurvey.project.symbol
              }/survey/${comment.issue.resolvingProjectSurvey.id}`}
            >{`issue resolved in document v${
              comment.issue.resolvingProjectSurvey.hierarchyLevel
            }`}</Link>
          </span>
        ) : null}
        <ActionBar
          item={comment}
          hasUpvoted={hasUpvoted}
          initReplyToThis={initReplyToThis}
          upvoteItem={upvoteItem}
          openModal={openModal}
          labelAsSpam={() => this.labelAsSpam(comment, null)}
          labelAsNotSpam={() => this.labelAsNotSpam(comment, null)}
        />
      </div>
    );
  }

  renderReplies(replies, rootId) {
    return orderBy(
      replies.map(
        reply =>
          isEmpty(reply)
            ? reply
            : assignIn({ unix: moment(reply.createdAt).format("X") }, reply)
      ),
      ["unix", "upvotesFrom.length"],
      ["asc", "desc"]
    ).map((reply, i) => {
      const hasUpvoted = find(
        reply.upvotesFrom,
        upvotedUser => upvotedUser.id === this.props.user.id
      );
      const upvoteItem = this.props.isLoggedIn
        ? this.props.upvoteItem.bind(this, {
            rootId,
            comment: reply,
            hasUpvoted
          })
        : this.promptLoginToast;
      const openModal = this.openModal.bind(null, reply, false, false);
      const initReplyToThis = this.props.isLoggedIn
        ? this.initReply.bind(this, reply)
        : this.promptLoginToast;
      return (
        <div
          className={`comment-item__reply-item ${
            i === replies.length - 1 ? "last-item" : ""
          }`}
          key={`comment-item__reply-${reply.id}`}
        >
          <div className="comment-item__header">
            <p>{reply.owner.displayName}</p>
            <p>{moment(reply.createdAt).fromNow()}</p>
          </div>
          {reply.reviewed === "spam" ? (
            <p className="comment-item__comment">[deleted]</p>
          ) : (
            <p className="comment-item__comment">
              {reply.hierarchyLevel !== 2 && (
                <span className="comment-item__at-someone">
                  {"@" + reply.parent.owner.displayName}
                </span>
              )}{" "}
              {reply.comment}
            </p>
          )}
          <ActionBar
            item={reply}
            hasUpvoted={hasUpvoted}
            initReplyToThis={initReplyToThis}
            upvoteItem={upvoteItem}
            openModal={openModal}
            labelAsSpam={() => this.labelAsSpam(reply, rootId)}
            labelAsNotSpam={() => this.labelAsNotSpam(reply, rootId)}
          />
        </div>
      );
    });
  }
}
