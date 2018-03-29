import React, { Component } from "react";
import { Link } from "react-router-dom";
import autoBind from "react-autobind";
import { findFirstAnnotationInQna, findAnnotationsInQna } from "../../utils";

export default class AnnotationSidebarHeader extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  renderAnnotationCount({ annotationIds, annotationsById, selectedQna }) {
    const annotations = findAnnotationsInQna({
      annotationIds,
      annotationsById,
      survey_question_id: selectedQna
    });
    if (annotationIds && selectedQna && annotations && annotations.length) {
      return (
        <p
          className="annotations-header reset-selection"
          onClick={this.props.resetSelectedQna}
        >
          Show all Annotation ({annotationIds.length})
        </p>
      );
    } else if (
      (annotationIds && !selectedQna) ||
      (annotationIds &&
        selectedQna &&
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
      selectedQna,
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
          selectedQna
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
