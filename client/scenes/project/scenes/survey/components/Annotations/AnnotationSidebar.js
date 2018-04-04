import "./index.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { AuthWidget } from "../../../../../../components";
import { connect } from "react-redux";
import { toggleSidebar, toggleHighlights } from "../../reducer";

class AnnotationSidebar extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    var style = this.props.sidebarOpen
      ? {
          marginLeft: this.props.width < 767 ? "-350px" : "-410px"
        }
      : {
          marginLeft: "-10px"
        };
    var sizeBtnAngle = this.props.sidebarOpen ? "right" : "left";
    var eye = this.props.showHighlights ? "eye" : "eye-slash";

    return (
      <div className="annotation-sidebar" style={style}>
        <div className="annotation-coordinate__container" />
        <div className="annotation-toolbar">
          <button
            className="annotations-sidebar__size-btn"
            onClick={this.props.toggleSidebar}
          >
            <i class={`fas fa-angle-${sizeBtnAngle}`} />
          </button>
          <button
            className="annotations__visibility-btn"
            onClick={this.props.toggleHighlights}
          >
            <i class={`fas fa-${eye}`} />
          </button>
          {this.props.sidebarOpen && <AuthWidget />}
        </div>
        {this.props.children}
      </div>
    );
  }
}

const mapState = state => {
  const { sidebarOpen, showHighlights } = state.scenes.project.scenes.survey;
  return { sidebarOpen, showHighlights };
};

const actions = { toggleSidebar, toggleHighlights }

export default connect(mapState, actions)(AnnotationSidebar);
