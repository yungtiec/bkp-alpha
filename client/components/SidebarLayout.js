import "./SidebarLayout.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { AuthWidget } from "./index";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHighlights: true
    };
    autoBind(this);
  }

  render() {
    const {
      toggleSidebar,
      sidebarOpen,
      width,
      children,
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
    var book = sidebarContext === "comments" ? "list-ul" : "arrow-left";
    var tabStyle = {
      width: width < 767 ? "348px" : width > 1300 ? "-448px" : "408px"
    };

    return (
      <div className="sidebar" style={style}>
        <div className="annotation-coordinate__container" />
        <div className="sidebar__toolbar">
          {sidebarOpen && <AuthWidget dataTip={true} dataFor="auth-widget" />}
          <ReactTooltip id="auth-widget" type="dark">
            <span>Your profile</span>
          </ReactTooltip>
          <button
            data-tip
            data-for="hide-sidebar"
            className="social-toolbar__size-btn"
            onClick={toggleSidebar}
          >
            <i className={`fas fa-angle-${sizeBtnAngle}`} />
          </button>
          <ReactTooltip id="hide-sidebar" type="dark">
            <span>{sidebarOpen ? "Hide sidebar" : "Show sidebar"}</span>
          </ReactTooltip>
          {sidebarOpen &&
            toggleSidebarContext && (
              <button
                data-tip
                data-for="table-of-contents"
                className="social-toolbar__table-of-contents-btn"
                onClick={toggleSidebarContext}
              >
                <i className={`fas fa-${book}`} />
              </button>
            )}
          <ReactTooltip id="table-of-contents" type="dark">
            <span>
              {sidebarContext === "comments"
                ? "Table of contents"
                : "back to comments"}
            </span>
          </ReactTooltip>
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
