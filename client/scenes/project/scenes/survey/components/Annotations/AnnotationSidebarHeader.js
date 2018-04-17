import React, { Component } from "react";
import { Link } from "react-router-dom";
import autoBind from "react-autobind";
import { findAnnotationsInQnaByText } from "../../utils";
import Select from "react-select";
import { keys } from "lodash";

export default class AnnotationSidebarHeader extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  renderAnnotationCount({ selectedAnnotations, annotationIds }) {
    if (selectedAnnotations) {
      return (
        <p
          className="annotation-sidebar__engagement-tab reset-selection"
          onClick={this.props.resetSelection}
        >
          Show all Annotations ({annotationIds.length})
        </p>
      );
    } else {
      return (
        <p className="annotation-sidebar__engagement-tab">
          Annotations ({annotationIds.length})
        </p>
      );
    }
  }

  renderCommentCount({ selectedAnnotations, annotationIds, commentIds }) {
    if (selectedAnnotations) return null;
    return (
      <p className="annotation-sidebar__engagement-tab">
        Page Comments ({annotationIds.length})
      </p>
    );
  }

  handleSortByChange(selectedOption) {
    if (selectedOption.value !== this.props.sortBy) {
      this.props.sortAnnotationBy(selectedOption.value);
    }
  }

  renderSortBy(sortBy) {
    return (
      <div
        className="annotation-sidebar__sort-by btn-group"
        role="group"
        aria-label="Basic example"
      >
        <span>sort by</span>
        <Select
          name="form-field-name"
          value={sortBy}
          onChange={this.handleSortByChange}
          options={[
            { value: "position", label: "position" },
            { value: "timestamp", label: "timestamp" },
            { value: "upvotes", label: "upvotes" }
          ]}
        />
      </div>
    );
  }

  handleTagFilterChange(selectedOptions) {
    const { updateTagFilter } = this.props;
    if (selectedOptions) {
      updateTagFilter(selectedOptions);
    }
  }

  render() {
    const {
      isLoggedIn,
      selectedAnnotations,
      annotationIds,
      sortBy,
      tagsWithCountInSurvey,
      tagFilter,
      updateTagFilter
    } = this.props;

    return (
      <div>
        <div className="annotation-sidebar__engagement-tab-container">
          {this.renderAnnotationCount({ selectedAnnotations, annotationIds })}
          {this.renderCommentCount({ selectedAnnotations, annotationIds })}
        </div>
        {!selectedAnnotations && this.renderSortBy(sortBy)}
        {!selectedAnnotations && (
          <div className="annotation-tags__filter-container">
            <span className="select-label">filter by tag(s)</span>
            <Select
              name="annotation-tags__filter"
              className="annotation-tags__filter"
              placeholder="select tag(s)"
              multi={true}
              value={tagFilter}
              onChange={this.handleTagFilterChange}
              options={tagsWithCountInSurvey}
            />
          </div>
        )}
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
