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
      updateVerificationStatusInView,
      toggleSidebar,
      sidebarOpen,
      selectedComments,
      verificationStatus,
      width,
      children,
      uploadMode
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
    var eye = this.state.showHighlights ? "eye" : "eye-slash";
    var tabStyle = {
      width: width < 767 ? "348px" : width > 1300 ? "-448px" : "408px"
    };

    return (
      <div className="social-sidebar" style={style}>
        <div className="annotation-coordinate__container" />
        <div className="social-sidebar__toolbar">
          {sidebarOpen && <AuthWidget />}
          <button className="social-toolbar__size-btn" onClick={toggleSidebar}>
            <i className={`fas fa-angle-${sizeBtnAngle}`} />
          </button>
          {uploadMode ? null : (
            <button
              className="social-toolbar__visibility-btn"
              onClick={this.toggleHighlights}
            >
              <i className={`fas fa-${eye}`} />
            </button>
          )}
        </div>
        <div>
          <div className="social-sidebar__logo-consensys">
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

  renderVerificationStatusTab({
    tabStyle,
    verificationStatus,
    selectedComments
  }) {
    return (
      <div
        className="social-sidebar__status-tab-container"
        role="group"
        aria-label="Basic example"
        style={tabStyle}
      >
        <button
          type="button"
          className={`social-sidebar__status-tab ${verificationStatus ===
            "all" &&
            selectedComments &&
            !selectedComments.length &&
            "active"}`}
          onClick={() => this.props.updateVerificationStatusInView("all")}
        >
          all
        </button>
        <button
          type="button"
          className={`social-sidebar__status-tab ${verificationStatus ===
            "verified" &&
            selectedComments &&
            !selectedComments.length &&
            "active"}`}
          onClick={() => this.props.updateVerificationStatusInView("verified")}
        >
          verified
        </button>
        <button
          type="button"
          className={`social-sidebar__status-tab ${verificationStatus ===
            "pending" &&
            selectedComments &&
            !selectedComments.length &&
            "active"}`}
          onClick={() => this.props.updateVerificationStatusInView("pending")}
        >
          pending
        </button>
      </div>
    );
  }
}

export default Sidebar;
