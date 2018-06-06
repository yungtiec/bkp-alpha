import "./SidebarHeader.scss";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import autoBind from "react-autobind";
import { findAnnotationsInQnaByText } from "../../utils";
import Select from "react-select";
import { keys } from "lodash";

export default class SidebarHeader extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleSortByChange(selectedOption) {
    if (selectedOption.value !== this.props.annotationSortBy) {
      this.props.sortAnnotationBy(selectedOption.value);
    }
  }

  renderAnnotationSortBy({ annotationSortBy }) {
    return (
      <div
        className="social-sidebar__sort-by btn-group"
        role="group"
        aria-label="Basic example"
      >
        <span>sort by</span>
        <Select
          name="form-field-name"
          value={annotationSortBy}
          onChange={this.handleSortByChange}
          options={[
            { value: "position", label: "position" },
            { value: "timestamp", label: "date" },
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

  handleIssueFilterChange(selectedOptions) {
    const { updateIssueFilter } = this.props;
    if (selectedOptions) {
      updateIssueFilter(selectedOptions.map(s => s.value));
    }
  }

  render() {
    const {
      isLoggedIn,
      selectedAnnotations,
      annotationIds,
      annotationSortBy,
      tagsWithCountInSurvey,
      tagFilter,
      updateTagFilter,
      annotationIssueFilter,
      commentIssueFilter
    } = this.props;

    return (
      <div>
        {selectedAnnotations && !selectedAnnotations.length ? (
          <div className="social-sidebar__engagement-tab-container">
            <p className="social-sidebar__engagement-tab">
              Annotations ({annotationIds.length})
            </p>
          </div>
        ) : (
          <div className="social-sidebar__engagement-tab-container">
            <p
              className="social-sidebar__engagement-tab active reset-selection"
              onClick={this.props.resetSelection}
            >
              Show all Annotations ({annotationIds.length})
            </p>
          </div>
        )}
        {selectedAnnotations &&
          !selectedAnnotations.length &&
          this.renderAnnotationSortBy({
            annotationSortBy
          })}
        {selectedAnnotations &&
          !selectedAnnotations.length && (
            <div className="social-sidebar__issue-filter-container">
              <span className="select-label">filter by issue</span>
              <Select
                name="social-sidebar__issue-filter"
                className="social-sidebar__issue-filter"
                placeholder="select issue status"
                multi={true}
                value={annotationIssueFilter}
                onChange={this.handleIssueFilterChange}
                options={[
                  { value: "open", label: "open" },
                  { value: "closed", label: "closed" }
                ]}
              />
            </div>
          )}
        {selectedAnnotations &&
          !selectedAnnotations.length && (
            <div className="social-sidebar__tag-filter-container">
              <span className="select-label">filter by tag(s)</span>
              <Select
                name="social-sidebar__tag-filter"
                className="social-sidebar__tag-filter"
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
