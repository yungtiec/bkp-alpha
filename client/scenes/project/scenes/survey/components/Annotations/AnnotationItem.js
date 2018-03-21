import React, { Component } from "react";
import autoBind from "react-autobind";
import moment from "moment";

export default class AnnotationItem extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { annotation } = this.props;

    return (
      <div className="annotation-item">
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
}
