import React, { Component } from "react";
import { Link } from "react-router-dom";
import autoBind from "react-autobind";
import { findAnnotationsInQnaByText } from "../../utils";

export default class AnnotationSidebarHeader extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  renderAnnotationCount({
    annotationIds,
    unfilteredAnnotationIds,
    annotationsById,
    selectedText
  }) {
    const annotations = findAnnotationsInQnaByText({
      annotationIds: unfilteredAnnotationIds,
      annotationsById,
      text: selectedText
    });
    if (
      annotationIds &&
      selectedText &&
      annotations &&
      annotations.length
    ) {
      return (
        <p
          className="annotations-header__count reset-selection"
          onClick={this.props.resetSelection}
        >
          Show all Annotations ({annotationIds.length})
        </p>
      );
    } else if (
      (annotationIds && !selectedText) ||
      (annotationIds &&
        selectedText &&
        (!annotations || (annotations && !annotations.length)))
    ) {
      return (
        <p className="annotations-header__count">
          Annotations ({annotationIds.length})
        </p>
      );
    } else {
      return <p className="annotations-header__count">Annotation</p>;
    }
  }

  render() {
    const {
      unfilteredAnnotationIds,
      annotationsById,
      selectedText,
      isLoggedIn,
      annotationIds
    } = this.props;

    return (
      <div>
        {this.renderAnnotationCount({
          annotationIds,
          unfilteredAnnotationIds,
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
