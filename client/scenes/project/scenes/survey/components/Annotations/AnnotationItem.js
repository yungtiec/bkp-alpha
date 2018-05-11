import "./AnnotationItem.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import moment from "moment";
import { cloneDeep, isEmpty, find, orderBy, assignIn } from "lodash";
import { CommentBox } from "../index";
import ActionBar from "./ActionBar";

export default class AnnotationItem extends Component {
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
    const { annotation, engagementTab } = this.props;
    return (
      <div className="annotation-item">
        {this.renderMainComment(engagementTab, annotation)}
        {this.state.showReplies && (
          <p
            className="mb-3 annotation-item__collapse-btn"
            onClick={this.toggleShowReplies}
          >
            - Collapse replies
          </p>
        )}
        {annotation.descendents.length < 3 || this.state.showReplies ? (
          <div className="ml-3">
            {this.renderReplies(
              engagementTab,
              annotation.descendents,
              annotation.id
            )}
          </div>
        ) : (
          <p onClick={this.toggleShowReplies}>
            + View {annotation.descendents.length} replies
          </p>
        )}
        {this.state.isCommenting ? (
          <div>
            {this.state.replyTarget && (
              <span className="ml-1">{`replying to ${this.state.replyTarget.owner.first_name} ${
                this.state.replyTarget.owner.last_name
              }`}</span>
            )}
            <CommentBox
              rootId={annotation.id}
              parentId={
                this.state.replyTarget
                  ? this.state.replyTarget.id
                  : annotation.id
              }
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

  openModal(annotation, showIssueCheckbox, showTags) {
    this.props.loadModal("ANNOTATION_EDIT_MODAL", {
      ...annotation,
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

  labelAsNotSpam(annotation, rootId) {
    this.props.verifyItemAsAdmin({ annotation, rootId, reviewed: "verified" });
  }

  labelAsSpam(annotation, rootId) {
    this.props.verifyItemAsAdmin({ annotation, rootId, reviewed: "spam" });
  }

  toggleShowReplies() {
    this.setState(prevState => ({
      showReplies: !prevState.showReplies
    }));
  }

  renderMainComment(engagementTab, annotation) {
    const hasUpvoted = find(
      annotation.upvotesFrom,
      user => user.email === this.props.userEmail
    );
    const initReplyToThis = this.props.userEmail
      ? this.initReply.bind(this, null)
      : this.promptLoginToast;
    const upvoteItem = this.props.userEmail
      ? this.props.upvoteItem.bind(this, {
          itemId: annotation.id,
          hasUpvoted
        })
      : this.promptLoginToast;
    const openModal = this.openModal.bind(null, annotation, true, true);
    const changeItemIssueStatus = this.props.changeItemIssueStatus.bind(
      null,
      annotation
    );
    return (
      <div className="annotation-item__main">
        <div className="annotation-item__header">
          <p>
            {annotation.owner.first_name + " " + annotation.owner.last_name}
          </p>
          <p>{moment(annotation.createdAt).fromNow()}</p>
        </div>
        {engagementTab === "annotations" && (
          <p className="annotation-item__quote">{annotation.quote}</p>
        )}
        <div className="annotation-item__tags">
          {annotation.issue &&
            (annotation.issue.open ? (
              <span
                key={`annotation-${annotation.id}__tag-issue--open`}
                className="badge badge-danger issue"
                onClick={changeItemIssueStatus}
              >
                issue:open
                <i className="fas fa-times" />
              </span>
            ) : (
              <span
                key={`annotation-${annotation.id}__tag-issue--close`}
                className="badge badge-light"
              >
                issue:close
              </span>
            ))}
          {annotation.tags && annotation.tags.length
            ? annotation.tags.map(tag => (
                <span
                  key={`annotation-${annotation.id}__tag-${tag.name}`}
                  className="badge badge-light"
                >
                  {tag.name}
                  {"  "}
                </span>
              ))
            : ""}
        </div>
        <p className="annotation-item__comment">{annotation.comment}</p>
        <ActionBar
          item={annotation}
          hasUpvoted={hasUpvoted}
          isAdmin={this.props.admin}
          thisUserEmail={this.props.userEmail}
          initReplyToThis={initReplyToThis}
          upvoteItem={upvoteItem}
          openModal={openModal}
          labelAsSpam={() => this.labelAsSpam(annotation, null)}
          labelAsNotSpam={() => this.labelAsNotSpam(annotation, null)}
        />
      </div>
    );
  }

  renderReplies(engagementTab, replies, rootId) {
    return orderBy(
      replies.map(
        reply =>
          isEmpty(reply)
            ? reply
            : assignIn({ unix: moment(reply.createdAt).format("X") }, reply)
      ),
      ["unix", "upvotesFrom.length"],
      ["asc", "desc"]
    ).map(reply => {
      if (reply.reviewed === "spam") return null;
      const hasUpvoted = find(
        reply.upvotesFrom,
        user => user.email === this.props.userEmail
      );
      const upvoteItem = this.props.userEmail
        ? this.props.upvoteItem.bind(this, {
            itemId: reply.id,
            hasUpvoted
          })
        : this.promptLoginToast;
      const openModal = this.openModal.bind(null, reply, false, false);
      const initReplyToThis = this.props.userEmail
        ? this.initReply.bind(this, reply)
        : this.promptLoginToast;
      return (
        <div
          className="annotation-item__reply-item"
          key={`annotation-item__reply-${reply.id}`}
        >
          <div className="annotation-item__header">
            <p>{reply.owner.first_name + " " + reply.owner.last_name}</p>
            <p>{moment(reply.createdAt).fromNow()}</p>
          </div>
          {reply.reviewed === "spam" ? (
            <p className="annotation-item__comment">[deleted]</p>
          ) : (
            <p className="annotation-item__comment">
              {reply.hierarchyLevel !== 2 && (
                <span className="annotation-item__at-someone">
                  {"@" +
                    reply.parent.owner.first_name +
                    " " +
                    reply.parent.owner.last_name}
                </span>
              )}{" "}
              {reply.comment}
            </p>
          )}
          <ActionBar
            item={reply}
            hasUpvoted={hasUpvoted}
            isAdmin={this.props.admin}
            thisUserEmail={this.props.userEmail}
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
