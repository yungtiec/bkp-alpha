import "./AnnotationItem.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import moment from "moment";
import { cloneDeep, isEmpty, find } from "lodash";
import CommentBox from "./CommentBox";
import {
  replyToAnnotation,
  initiateReplyToAnnotation,
  cancelReplyToAnnotation,
  upvoteAnnotation,
  verifyAnnotationAsAdmin
} from "../../data/annotations/actions";
import { loadModal } from "../../../../../../data/reducer";
import { notify } from "reapop";

class AnnotationItem extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  reply(parent) {
    this.props.replyToAnnotation({ parent, comment: "test" });
  }

  initReply(accessors, parent) {
    accessors.push(parent.id);
    this.props.initiateReplyToAnnotation({ accessors, parent });
  }

  cancelReply(accessors, parent) {
    accessors.push(parent.id);
    this.props.cancelReplyToAnnotation({ accessors, parent });
  }

  openModal(annotation) {
    this.props.loadModal("ANNOTATION_EDIT_MODAL", annotation);
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
    this.props.verifyAnnotationAsAdmin(annotationId, "verified");
  }

  labelAsSpam(annotationId) {
    this.props.verifyAnnotationAsAdmin(annotationId, "spam");
  }

  renderAdminActions(annotation) {
    return this.props.admin && annotation.reviewed === "pending" ? (
      <div class="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          class="btn btn-outline-danger btn-sm"
          onClick={() => this.labelAsSpam(annotation.id)}
        >
          spam
        </button>
        <button
          type="button"
          class="btn btn-outline-primary btn-sm"
          onClick={() => this.labelAsNotSpam(annotation.id)}
        >
          verify
        </button>
      </div>
    ) : (
      <div
        className={`annotation-item__verified-message ${annotation.reviewed}`}
      >
        {annotation.reviewed === 'verified' ? annotation.reviewed : ''}
      </div>
    );
  }

  renderMainComment(annotation) {
    const initReplyToThis = this.props.userEmail
      ? this.initReply.bind(this, [], annotation)
      : this.promptLoginToast;
    const hasUpvoted = find(
      annotation.upvotesFrom,
      user => user.email === this.props.userEmail
    );
    const upvoteAnnotation = this.props.userEmail
      ? this.props.upvoteAnnotation.bind(this, {
          annotationId: annotation.id,
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
        <p className="annotation-item__quote">{annotation.quote}</p>
        <p className="annotation-item__comment">{annotation.comment}</p>
        <div className="annotation-item__action--bottom">
          {this.renderAdminActions(annotation)}
          <div>
            {annotation.owner.email === this.props.userEmail && (
              <i class="fas fa-edit" onClick={openModal} />
            )}
            <i className="fas fa-reply" onClick={initReplyToThis} />
            <span className={`${hasUpvoted ? "upvoted" : ""}`}>
              <i className="fas fa-thumbs-up" onClick={upvoteAnnotation} />
              {annotation.upvotesFrom ? annotation.upvotesFrom.length : 0}
            </span>
          </div>
        </div>
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
      const upvoteAnnotation = this.props.userEmail
        ? this.props.upvoteAnnotation.bind(this, {
            annotationId: child.id,
            hasUpvoted
          })
        : this.promptLoginToast;
      const openModal = this.openModal.bind(null, child);
      const reply = isEmpty(child) ? (
        <CommentBox
          parentId={accessors.slice(-1)[0]}
          onSubmit={this.props.replyToAnnotation}
          onCancel={cancelReplyToThis}
        />
      ) : (
        <div className="annotation-item__reply-item">
          <div className="annotation-item__header">
            <p>{child.owner.first_name + " " + child.owner.last_name}</p>
            <p>{moment(child.createdAt).format("MMM D, YYYY  hh:mmA")}</p>
          </div>
          <p className="annotation-item__comment">{child.comment}</p>
          <div className="annotation-item__action--bottom">
            {this.renderAdminActions(child)}
            <div>
              {child.owner.email === this.props.userEmail && (
                <i class="fas fa-edit" onClick={openModal} />
              )}
              <i className="fas fa-reply" onClick={initReplyToThis} />
              <span className={`${hasUpvoted ? "upvoted" : ""}`}>
                <i className="fas fa-thumbs-up" onClick={upvoteAnnotation} />
                {child.upvotesFrom ? child.upvotesFrom.length : 0}
              </span>
            </div>
          </div>
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
            <i class="fas fa-caret-down" />
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

  render() {
    const { annotation } = this.props;
    return (
      <div className="annotation-item">
        {this.renderMainComment(annotation)}
        {this.renderThread(annotation.children, [annotation.id])}
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  userEmail: state.data.user.email,
  admin:
    state.data.user.roles &&
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

export default connect(mapState, actions)(AnnotationItem);
