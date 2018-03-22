import React, { Component } from "react";
import autoBind from "react-autobind";
import moment from "moment";

export default class AnnotationItem extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  renderMainComment(annotation) {
    return (
      <div className="annotation-item__main">
        <div className="annotation-item__header">
          <p>tammy</p>
          <p>{moment(annotation.createdAt).format("MMM D, YYYY  hh:mmA")}</p>
        </div>
        <p className="annotation-item__text">{annotation.quote}</p>
        <p className="annotation-item__note">{annotation.text}</p>
        <div className="annotation-item__action--bottom">
          <i className="fas fa-reply" />
          <i className="fas fa-star" />
        </div>
      </div>
    );
  }

  renderThread(children) {
    const replies = children.map(child => {
      const reply = (
        <div className="annotation-item__reply">
          <div className="annotation-item__header">
            <p>tammy</p>
            <p>{moment(child.createdAt).format("MMM D, YYYY  hh:mmA")}</p>
          </div>
          <p className="annotation-item__note">{child.text}</p>
          <div className="annotation-item__action--bottom">
            <i className="fas fa-reply" />
            <i className="fas fa-star" />
          </div>
        </div>
      );

      let subReplies;
      if (child.children && child.children.length) {
        subReplies = this.renderThread(child.children);
      }

      return (
        <div>
          {reply}
          {subReplies}
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
        {this.renderThread(annotation.children)}
      </div>
    );
  }
}
