import React, { Component } from "react";
import { Link } from "react-router-dom";
import autoBind from "react-autobind";
import { findAnnotationsInQnaByText } from "../../utils";

export default class AnnotationSidebarHeader extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  renderAnnotationCount({ annotationIds, annotationsById, selectedText }) {
    const annotations = findAnnotationsInQnaByText({
      annotationIds,
      annotationsById,
      text: selectedText
    });
    if (annotationIds && selectedText && annotations && annotations.length) {
      return (
        <p
          className="annotations-header reset-selection"
          onClick={this.props.resetSelection}
        >
          Show all Annotation ({annotationIds.length})
        </p>
      );
    } else if (
      (annotationIds && !selectedText) ||
      (annotationIds &&
        selectedText &&
        (!annotations || (annotations && !annotations.length)))
    ) {
      return (
        <p className="annotations-header">
          Annotation ({annotationIds.length})
        </p>
      );
    } else {
      return <p className="annotations-header">Annotation</p>;
    }
  }

  render() {
    const {
      annotationIds,
      annotationsById,
      selectedText,
      isLoggedIn
    } = this.props;

    return (
      <div>
        <div className="annotation-sidebar__logo-consensys">
          <img
            width="100px"
            height="auto"
            className="logo__large"
            src="/assets/consensys-logo-white-transparent.png"
          />
        </div>
        {this.renderAnnotationCount({
          annotationIds,
          annotationsById,
          selectedText
        })}
        {!isLoggedIn && (
          <div className="annotation-item">
            <div className="annotation-item__main">
              <div className="annotation-item__header">
                <p>
                  <Link to="/login">Login</Link> or{" "}
                  <Link to="/signup">signup</Link> to create an annotation
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
