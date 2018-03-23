import './index.scss'
import React, { Component } from "react";
import autoBind from "react-autobind";

export default class AnnotationSidebar extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    return (
      <div className="annotation-sidebar">
        <div className="annotation-coordinate__container" />
        <div className="annotation-toolbar">
          <button className="annotations-sidebar__size-btn">
            <i class="fas fa-angle-left" />
          </button>
          <button className="annotations__visibility-btn">
            <i class="fas fa-eye" />
          </button>
        </div>
        {this.props.children}
      </div>
    );
  }
}
