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
  upvoteAnnotation
} from "../../data/annotations/actions";
import { loadModal } from "../../../../../../data/reducer";

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
    this.props.loadModal('ANNOTATION_EDIT_MODAL', annotation)
  }

  renderMainComment(annotation) {
    const initReplyToThis = this.initReply.bind(this, [], annotation);
    const hasUpvoted = find(
      annotation.upvotesFrom,
      user => user.email === this.props.userEmail
    );
    const upvoteAnnotation = this.props.upvoteAnnotation.bind(this, {
      annotationId: annotation.id,
      hasUpvoted
    });
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
    );
  }

  renderThread(children, parentIds) {
    if (!children) return "";
    var accessors = cloneDeep(parentIds);
    const replies = children.map(child => {
      const initReplyToThis = this.initReply.bind(this, accessors, child);
      const cancelReplyToThis = this.cancelReply.bind(this, accessors, child);
      const hasUpvoted = find(
        child.upvotesFrom,
        user => user.email === this.props.userEmail
      );
      const upvoteAnnotation = this.props.upvoteAnnotation.bind(this, {
        annotationId: child.id,
        hasUpvoted
      });
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
  ...ownProps
});

const actions = {
  replyToAnnotation,
  initiateReplyToAnnotation,
  cancelReplyToAnnotation,
  upvoteAnnotation,
  loadModal
};

export default connect(mapState, actions)(AnnotationItem);
