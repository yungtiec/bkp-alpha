import "./EngagementItem.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import moment from "moment";
import { cloneDeep, isEmpty, find, orderBy, assignIn } from "lodash";
import { CommentBox } from "../index";
import ActionBar from "./ActionBar";

export default class EngagementItem extends Component {
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
    const { engagementItem, engagementTab } = this.props;
    return (
      <div className="engagement-item">
        {this.renderMainComment(engagementItem)}
        {this.state.showReplies && (
          <p
            className="mb-3 engagement-item__collapse-btn"
            onClick={this.toggleShowReplies}
          >
            - Collapse replies
          </p>
        )}
        {engagementItem.descendents.length < 3 || this.state.showReplies ? (
          <div className="ml-3">
            {this.renderReplies(engagementItem.descendents, engagementItem.id)}
          </div>
        ) : (
          <p onClick={this.toggleShowReplies}>
            + View {engagementItem.descendents.length} replies
          </p>
        )}
        {this.state.isCommenting ? (
          <div>
            {this.state.replyTarget && (
              <span className="ml-1">{`replying to ${
                this.state.replyTarget.owner.first_name
              } ${this.state.replyTarget.owner.last_name}`}</span>
            )}
            <CommentBox
              rootId={engagementItem.id}
              parentId={
                this.state.replyTarget
                  ? this.state.replyTarget.id
                  : engagementItem.id
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

  openModal(engagementItem, showIssueCheckbox, showTags) {
    this.props.loadModal("ANNOTATION_EDIT_MODAL", {
      ...engagementItem,
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

  labelAsNotSpam(engagementItem, rootId) {
    this.props.verifyItemAsAdmin({
      engagementItem,
      rootId,
      reviewed: "verified"
    });
  }

  labelAsSpam(engagementItem, rootId) {
    this.props.verifyItemAsAdmin({ engagementItem, rootId, reviewed: "spam" });
  }

  toggleShowReplies() {
    this.setState(prevState => ({
      showReplies: !prevState.showReplies
    }));
  }

  renderMainComment(engagementItem) {
    const hasUpvoted = find(
      engagementItem.upvotesFrom,
      user => user.email === this.props.userEmail
    );
    const initReplyToThis = this.props.userEmail
      ? this.initReply.bind(this, null)
      : this.promptLoginToast;
    const upvoteItem = this.props.userEmail
      ? this.props.upvoteItem.bind(this, {
          rootId: null,
          itemId: engagementItem.id,
          hasUpvoted
        })
      : this.promptLoginToast;
    const openModal = this.openModal.bind(null, engagementItem, true, true);
    const changeItemIssueStatus = this.props.changeItemIssueStatus.bind(
      null,
      engagementItem
    );
    return (
      <div className="engagement-item__main">
        <div className="engagement-item__header">
          <p>
            {engagementItem.owner.first_name +
              " " +
              engagementItem.owner.last_name}
          </p>
          <p>{moment(engagementItem.createdAt).fromNow()}</p>
        </div>
        {engagementItem.engagementItemType === "annotation" && (
          <p className="engagement-item__quote">{engagementItem.quote}</p>
        )}
        <div className="engagement-item__tags">
          {engagementItem.issue &&
            (engagementItem.issue.open ? (
              <span
                key={`engagement-${engagementItem.id}__tag-issue--open`}
                className="badge badge-danger issue"
                onClick={changeItemIssueStatus}
              >
                issue:open
                <i className="fas fa-times" />
              </span>
            ) : (
              <span
                key={`engagement-${engagementItem.id}__tag-issue--close`}
                className="badge badge-light"
              >
                issue:close
              </span>
            ))}
          {engagementItem.tags && engagementItem.tags.length
            ? engagementItem.tags.map(tag => (
                <span
                  key={`engagement-${engagementItem.id}__tag-${tag.name}`}
                  className="badge badge-light"
                >
                  {tag.name}
                  {"  "}
                </span>
              ))
            : ""}
        </div>
        <p className="engagement-item__comment">{engagementItem.comment}</p>
        <ActionBar
          item={engagementItem}
          hasUpvoted={hasUpvoted}
          isAdmin={this.props.admin}
          thisUserEmail={this.props.userEmail}
          initReplyToThis={initReplyToThis}
          upvoteItem={upvoteItem}
          openModal={openModal}
          labelAsSpam={() => this.labelAsSpam(engagementItem, null)}
          labelAsNotSpam={() => this.labelAsNotSpam(engagementItem, null)}
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
    ).map(reply => {
      if (reply.reviewed === "spam") return null;
      const hasUpvoted = find(
        reply.upvotesFrom,
        user => user.email === this.props.userEmail
      );
      const upvoteItem = this.props.userEmail
        ? this.props.upvoteItem.bind(this, {
            rootId,
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
          className="engagement-item__reply-item"
          key={`engagement-item__reply-${reply.id}`}
        >
          <div className="engagement-item__header">
            <p>{reply.owner.first_name + " " + reply.owner.last_name}</p>
            <p>{moment(reply.createdAt).fromNow()}</p>
          </div>
          {reply.reviewed === "spam" ? (
            <p className="engagement-item__comment">[deleted]</p>
          ) : (
            <p className="engagement-item__comment">
              {reply.hierarchyLevel !== 2 && (
                <span className="engagement-item__at-someone">
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
