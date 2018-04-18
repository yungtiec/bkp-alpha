import "./AnnotationItem.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import moment from "moment";
import { cloneDeep, isEmpty, find } from "lodash";
import { CommentBox } from "../index";
import ActionBar from "./ActionBar";

export default class AnnotationItem extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { annotation, engagementTab } = this.props;
    return (
      <div className="annotation-item">
        {this.renderMainComment(engagementTab, annotation)}
        {this.renderThread(annotation.children, [annotation.id])}
      </div>
    );
  }

  initReply(accessors, parent) {
    accessors.push(parent.id);
    this.props.initiateReplyToItem({ accessors, parent });
  }

  cancelReply(accessors, parent) {
    accessors.push(parent.id);
    this.props.cancelReplyToItem({ accessors, parent });
  }

  openModal(annotation) {
    this.props.loadModal("ANNOTATION_EDIT_MODAL", {
      ...annotation,
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

  labelAsNotSpam(annotationId) {
    this.props.verifyItemAsAdmin(annotationId, "verified");
  }

  labelAsSpam(annotationId) {
    this.props.verifyItemAsAdmin(annotationId, "spam");
  }

  renderMainComment(engagementTab, annotation) {
    const hasUpvoted = find(
      annotation.upvotesFrom,
      user => user.email === this.props.userEmail
    );
    const initReplyToThis = this.props.userEmail
      ? this.initReply.bind(this, [], annotation)
      : this.promptLoginToast;
    const upvoteItem = this.props.userEmail
      ? this.props.upvoteItem.bind(this, {
          itemId: annotation.id,
          hasUpvoted
        })
      : this.promptLoginToast;
    const openModal = this.openModal.bind(null, annotation);

    return (
      <div className="annotation-item__main">
        <div className="annotation-item__header">
          <p>
            {annotation.owner.first_name + " " + annotation.owner.last_name}
          </p>
          <p>{moment(annotation.createdAt).format("MMM D, YYYY  hh:mmA")}</p>
        </div>
        {engagementTab === "annotations" && (
          <p className="annotation-item__quote">{annotation.quote}</p>
        )}
        <div className="annotation-item__tags">
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
          labelAsSpam={this.labelAsSpam}
          labelAsNotSpam={this.labelAsNotSpam}
        />
      </div>
    );
  }

  renderThread(children, parentIds) {
    if (!children) return "";
    var accessors = cloneDeep(parentIds);
    const replies = children.map(child => {
      const initReplyToThis = this.props.userEmail
        ? this.initReply.bind(this, accessors, child)
        : this.promptLoginToast;
      const cancelReplyToThis = this.cancelReply.bind(this, accessors, child);
      const hasUpvoted = find(
        child.upvotesFrom,
        user => user.email === this.props.userEmail
      );
      const upvoteItem = this.props.userEmail
        ? this.props.upvoteItem.bind(this, {
            itemId: child.id,
            hasUpvoted
          })
        : this.promptLoginToast;
      const openModal = this.openModal.bind(null, child);
      const reply = isEmpty(child) ? (
        <CommentBox
          key={`annotation-item__init-reply-${child.id}`}
          parentId={accessors.slice(-1)[0]}
          onSubmit={this.props.replyToItem}
          onCancel={cancelReplyToThis}
        />
      ) : (
        <div
          className="annotation-item__reply-item"
          key={`annotation-item__reply-${child.id}`}
        >
          <div className="annotation-item__header">
            <p>{child.owner.first_name + " " + child.owner.last_name}</p>
            <p>{moment(child.createdAt).format("MMM D, YYYY  hh:mmA")}</p>
          </div>
          <p className="annotation-item__comment">
            {child.reviewed === "spam" ? "[deleted]" : child.comment}
          </p>
          <ActionBar
            item={child}
            hasUpvoted={hasUpvoted}
            isAdmin={this.props.admin}
            thisUserEmail={this.props.userEmail}
            initReplyToThis={initReplyToThis}
            upvoteItem={upvoteItem}
            openModal={openModal}
            labelAsSpam={this.labelAsSpam}
            labelAsNotSpam={this.labelAsNotSpam}
          />
        </div>
      );

      let subReplies;
      let subAccessor = cloneDeep(accessors);
      if (child.children && child.children.length) {
        subAccessor.push(child.id);
        subReplies = this.renderThread(child.children, subAccessor);
      }

      return (
        <div className="annotation-item__reply-thread">
          <div className="annotation-item__reply-edge">
            <i className="fas fa-caret-down" />
            <div className="annotation-item__thread-line" />
          </div>
          <div className="annotation-item__reply-contents">
            {reply}
            {subReplies}
          </div>
        </div>
      );
    });
    return replies;
  }
}
