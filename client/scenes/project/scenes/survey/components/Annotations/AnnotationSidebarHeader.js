import React, { Component } from "react";
import { Link } from "react-router-dom";
import autoBind from "react-autobind";
import { findAnnotationsInQnaByText } from "../../utils";

export default class AnnotationSidebarHeader extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  renderAnnotationCount({ selectedAnnotations, annotationIds }) {
    if (selectedAnnotations) {
      return (
        <p
          className="annotations-header__count reset-selection"
          onClick={this.props.resetSelection}
        >
          Show all Annotations ({annotationIds.length})
        </p>
      );
    } else {
      return (
        <p className="annotations-header__count">
          Annotations ({annotationIds.length})
        </p>
      );
    }
  }

  renderSortBy(sortBy) {
    return (
      <div class="btn-group" role="group" aria-label="Basic example">
        <span>sort by</span>
        <button
          type="button"
          class={`btn btn-outline-secondary btn-sm ${sortBy === "timestamp" &&
            "active"}`}
          onClick={() => this.props.sortAnnotationBy("timestamp")}
        >
          date
        </button>
        <button
          type="button"
          class={`btn btn-outline-secondary btn-sm ${sortBy === "upvotes" &&
            "active"}`}
          onClick={() => this.props.sortAnnotationBy("upvotes")}
        >
          upvotes
        </button>
      </div>
    );
  }

  render() {
    const {
      isLoggedIn,
      selectedAnnotations,
      annotationIds,
      sortBy
    } = this.props;

    return (
      <div>
        <div className="annotation-sidebar__menu">
          {this.renderAnnotationCount({ selectedAnnotations, annotationIds })}
          {!selectedAnnotations && this.renderSortBy(sortBy)}
        </div>
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
