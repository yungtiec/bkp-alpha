import "./index.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";

export default class AnnotationSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: true,
      showHighlights: true
    };
    autoBind(this);
  }

  toggleSidebar() {
    const next = !this.state.sidebarOpen;
    this.setState({
      sidebarOpen: next
    });
  }

  toggleHighlights() {
    const next = !this.state.showHighlights;
    this.setState({
      showHighlights: next
    });
    if (!next) {
      $(".annotator-hl").addClass("hidden");
    } else {
      $(".annotator-hl").removeClass("hidden");
    }
  }

  render() {
    var style = this.state.sidebarOpen
      ? {
          marginLeft: "-410px"
        }
      : {
          marginLeft: "-10px"
        };
    var sizeBtnAngle = this.state.sidebarOpen ? "right" : "left";
    var eye = this.state.showHighlights ? "eye" : "eye-slash";

    return (
      <div className="annotation-sidebar" style={style}>
        <div className="annotation-coordinate__container" />
        <div className="annotation-toolbar">
          <button
            className="annotations-sidebar__size-btn"
            onClick={this.toggleSidebar}
          >
            <i class={`fas fa-angle-${sizeBtnAngle}`} />
          </button>
          <button
            className="annotations__visibility-btn"
            onClick={this.toggleHighlights}
          >
            <i class={`fas fa-${eye}`} />
          </button>
        </div>
        {this.props.children}
      </div>
    );
  }
}
