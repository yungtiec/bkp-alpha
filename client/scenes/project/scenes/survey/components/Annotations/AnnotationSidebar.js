import "./index.scss";
import "./AnnotationSidebarHeader.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { AuthWidget } from "../../../../../../components";
import { connect } from "react-redux";
import { toggleSidebar, updateAnnotationTypeInView } from "../../reducer";

class AnnotationSidebar extends Component {
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
      updateAnnotationTypeInView,
      toggleSidebar,
      sidebarOpen,
      selectedAnnotations,
      annotationType,
      width,
      children
    } = this.props;
    var style = sidebarOpen
      ? {
          marginLeft: width < 767 ? "-350px" : "-410px"
        }
      : {
          marginLeft: "-10px"
        };
    var sizeBtnAngle = sidebarOpen ? "right" : "left";
    var eye = this.state.showHighlights ? "eye" : "eye-slash";
    var tabStyle = {
      width: width < 767 ? "348px" : "408px"
    };

    return (
      <div className="annotation-sidebar" style={style}>
        <div className="annotation-coordinate__container" />
        <div className="annotation-toolbar">
          <button
            className="annotations-sidebar__size-btn"
            onClick={toggleSidebar}
          >
            <i class={`fas fa-angle-${sizeBtnAngle}`} />
          </button>
          <button
            className="annotations__visibility-btn"
            onClick={this.toggleHighlights}
          >
            <i class={`fas fa-${eye}`} />
          </button>
          {sidebarOpen && <AuthWidget />}
        </div>
        <div style={{ height: "100px" }}>
          <div className="annotation-sidebar__logo-consensys">
            <img
              width="100px"
              height="auto"
              className="logo__large"
              src="/assets/consensys-logo-white-transparent.png"
            />
          </div>
          <div
            class="annotation-sidebar__tab-container"
            role="group"
            aria-label="Basic example"
            style={tabStyle}
          >
            <button
              type="button"
              class={`annotation-sidebar__tab ${annotationType === "all" &&
                !selectedAnnotations &&
                "active"}`}
              onClick={() => updateAnnotationTypeInView("all")}
            >
              all
            </button>
            <button
              type="button"
              class={`annotation-sidebar__tab ${annotationType === "verified" &&
                !selectedAnnotations &&
                "active"}`}
              onClick={() => updateAnnotationTypeInView("verified")}
            >
              verified
            </button>
            <button
              type="button"
              class={`annotation-sidebar__tab ${annotationType === "pending" &&
                !selectedAnnotations &&
                "active"}`}
              onClick={() => updateAnnotationTypeInView("pending")}
            >
              pending
            </button>
          </div>
        </div>
        {children}
      </div>
    );
  }
}

const mapState = state => {
  const { sidebarOpen, annotationType } = state.scenes.project.scenes.survey;
  return { sidebarOpen, annotationType };
};

const actions = { toggleSidebar, updateAnnotationTypeInView };

export default connect(mapState, actions)(AnnotationSidebar);
