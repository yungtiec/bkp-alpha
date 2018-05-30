import "./SidebarLayout.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { AuthWidget } from "../../../../../../components";
import { connect } from "react-redux";
import { toggleSidebar, updateVerificationStatusInView } from "../../reducer";

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
      selectedAnnotations,
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
          <button className="social-toolbar__size-btn" onClick={toggleSidebar}>
            <i className={`fas fa-angle-${sizeBtnAngle}`} />
          </button>
          <button
            className="social-toolbar__visibility-btn"
            onClick={this.toggleHighlights}
          >
            <i className={`fas fa-${eye}`} />
          </button>
          {sidebarOpen && <AuthWidget />}
        </div>
        <div style={{ height: "100px" }}>
          <div className="social-sidebar__logo-consensys">
            <img
              width="100px"
              height="auto"
              className="logo__large"
              src="/assets/consensys-logo-white-transparent.png"
            />
          </div>
          {uploadMode
            ? null
            : this.renderVerificationStatusTab({
                tabStyle,
                verificationStatus,
                selectedAnnotations
              })}
        </div>
        {children}
      </div>
    );
  }

  renderVerificationStatusTab({
    tabStyle,
    verificationStatus,
    selectedAnnotations
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
            selectedAnnotations &&
            !selectedAnnotations.length &&
            "active"}`}
          onClick={() => this.props.updateVerificationStatusInView("all")}
        >
          all
        </button>
        <button
          type="button"
          className={`social-sidebar__status-tab ${verificationStatus ===
            "verified" &&
            selectedAnnotations &&
            !selectedAnnotations.length &&
            "active"}`}
          onClick={() => this.props.updateVerificationStatusInView("verified")}
        >
          verified
        </button>
        <button
          type="button"
          className={`social-sidebar__status-tab ${verificationStatus ===
            "pending" &&
            selectedAnnotations &&
            !selectedAnnotations.length &&
            "active"}`}
          onClick={() => this.props.updateVerificationStatusInView("pending")}
        >
          pending
        </button>
      </div>
    );
  }
}

const mapState = state => {
  const {
    sidebarOpen,
    verificationStatus
  } = state.scenes.project.scenes.survey;
  return { sidebarOpen, verificationStatus };
};

const actions = { toggleSidebar, updateVerificationStatusInView };

export default connect(mapState, actions)(Sidebar);
