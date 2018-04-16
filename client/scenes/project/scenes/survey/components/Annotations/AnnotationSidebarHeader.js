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

  handleSortByChange(selectedOption) {
    if (selectedOption.value !== this.props.sortBy) {
      this.props.sortAnnotationBy(selectedOption.value);
    }
  }

  renderSortBy(sortBy) {
    return (
      <div class="btn-group" role="group" aria-label="Basic example">
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
        <div className="annotation-sidebar__menu">
          {this.renderAnnotationCount({ selectedAnnotations, annotationIds })}
          {!selectedAnnotations && this.renderSortBy(sortBy)}
        </div>
        {!selectedAnnotations && (
          <div className="annotation-tags__filter-container">
            <Select
              name="annotation-tags__filter"
              className="annotation-tags__filter"
              placeholder="Enter tag to filter annotations"
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
