import React, { Component } from "react";
import autoBind from "react-autobind";
import moment from "moment";
import { cloneDeep, isEmpty } from "lodash";

export default class AnnotationItem extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  reply(parent) {
    this.props.replyToAnnotation({ parent, comment: "test" });
  }

  initReply(accessors, parent) {
    accessors.push(parent.id)
    this.props.initiateReplyToAnnotation({accessors, parent})
  }

  renderMainComment(annotation) {
    const replyToThis = this.reply.bind(this, annotation);
    return (
      <div className="annotation-item__main">
        <div className="annotation-item__header">
          <p>tammy</p>
          <p>{moment(annotation.createdAt).format("MMM D, YYYY  hh:mmA")}</p>
        </div>
        <p className="annotation-item__text">{annotation.quote}</p>
        <p className="annotation-item__note">{annotation.text}</p>
        <div className="annotation-item__action--bottom">
          <i className="fas fa-reply" onClick={replyToThis} />
          <i className="fas fa-star" />
        </div>
      </div>
    );
  }

  renderThread(children, parentIds) {
    if (!children) return ''
    var accessors = cloneDeep(parentIds)
    const replies = children.map(child => {
      const replyToThis = this.reply.bind(this, child);
      const initReplyToThis = this.initReply.bind(this, accessors, child);
      const reply = isEmpty(child) ? 'comment box' : (
        <div className="annotation-item__reply-item">
          <div className="annotation-item__header">
            <p>tammy</p>
            <p>{moment(child.createdAt).format("MMM D, YYYY  hh:mmA")}</p>
          </div>
          <p className="annotation-item__note">{child.text}</p>
          <div className="annotation-item__action--bottom">
            <i className="fas fa-reply" onClick={initReplyToThis} />
            <i className="fas fa-star" />
          </div>
        </div>
      );

      let subReplies;
      let subAccessor = cloneDeep(accessors)
      if (child.children && child.children.length) {
        subAccessor.push(child.id)
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
