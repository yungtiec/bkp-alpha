import "./SidebarLayout.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { AuthWidget } from "./index";
import { connect } from "react-redux";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHighlights: true
    };
    autoBind(this);
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
    const {
      toggleSidebar,
      sidebarOpen,
      width,
      children,
      annotationHighlight,
      toggleAnnotationHighlight,
      sidebarContext,
      toggleSidebarContext
    } = this.props;
    var style = sidebarOpen
      ? {
          marginLeft:
            width < 767 ? "-350px" : width > 1300 ? "-450px" : "-410px"
        }
      : {
          marginLeft: "-10px"
        };
    var sizeBtnAngle = sidebarOpen ? "right" : "left";
    var eye = annotationHighlight ? "eye" : "eye-slash";
    var book = sidebarContext === "comments" ? "list-ul" : "arrow-left"
    var tabStyle = {
      width: width < 767 ? "348px" : width > 1300 ? "-448px" : "408px"
    };

    return (
      <div className="sidebar" style={style}>
        <div className="annotation-coordinate__container" />
        <div className="sidebar__toolbar">
          {sidebarOpen && <AuthWidget />}
          <button className="social-toolbar__size-btn" onClick={toggleSidebar}>
            <i className={`fas fa-angle-${sizeBtnAngle}`} />
          </button>
          {toggleAnnotationHighlight && (
            <button
              className="social-toolbar__visibility-btn"
              onClick={toggleAnnotationHighlight}
            >
              <i className={`fas fa-${eye}`} />
            </button>
          )}
          {toggleSidebarContext && (
            <button
              className="social-toolbar__table-of-contents-btn"
              onClick={toggleSidebarContext}
            >
              <i className={`fas fa-${book}`} />
            </button>
          )}
        </div>
        <div>
          <div className="sidebar__logo-consensys">
            <img
              width="100px"
              height="auto"
              className="logo__large"
              src="/assets/consensys-logo-white-transparent.png"
            />
          </div>
        </div>
        {children}
      </div>
    );
  }
}

export default Sidebar;
