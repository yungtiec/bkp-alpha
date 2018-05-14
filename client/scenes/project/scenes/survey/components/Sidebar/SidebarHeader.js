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
      this.props.engagementTab === "annotations" &&
        this.props.sortAnnotationBy(selectedOption.value);
      this.props.engagementTab === "comments" &&
        this.props.sortCommentBy(selectedOption.value);
    }
  }

  renderAnnotationSortBy({ engagementTab, commentSortBy, annotationSortBy }) {
    const sortBy =
      engagementTab === "annotations" ? annotationSortBy : commentSortBy;
    const options =
      engagementTab === "annotations"
        ? [
            { value: "position", label: "position" },
            { value: "timestamp", label: "date" },
            { value: "upvotes", label: "upvotes" }
          ]
        : [
            { value: "timestamp", label: "date" },
            { value: "upvotes", label: "upvotes" }
          ];
    return (
      <div
        className="social-sidebar__sort-by btn-group"
        role="group"
        aria-label="Basic example"
      >
        <span>sort by</span>
        <Select
          name="form-field-name"
          value={sortBy}
          onChange={this.handleSortByChange}
          options={options}
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
      engagementTab,
      updateEngagementTabInView,
      selectedAnnotations,
      annotationIds,
      annotationSortBy,
      commentSortBy,
      commentIds,
      tagsWithCountInSurvey,
      tagFilter,
      updateTagFilter,
      selectedComment
    } = this.props;
    return (
      <div>
        {selectedAnnotations &&
        !selectedAnnotations.length &&
        !selectedComment ? (
          <div className="social-sidebar__engagement-tab-container">
            <p
              className={`social-sidebar__engagement-tab ${
                engagementTab === "annotations" ? "active" : ""
              }`}
              onClick={() => updateEngagementTabInView("annotations")}
            >
              Annotations ({annotationIds.length})
            </p>
            <p
              className={`social-sidebar__engagement-tab ${
                engagementTab === "comments" ? "active" : ""
              }`}
              onClick={() => updateEngagementTabInView("comments")}
            >
              Page Comments ({commentIds.length})
            </p>
          </div>
        ) : selectedComment &&
        selectedAnnotations &&
        !selectedAnnotations.length ? (
          <div className="social-sidebar__engagement-tab-container">
            <p
              className="social-sidebar__engagement-tab active reset-selection"
              onClick={this.props.resetSelection}
            >
              Show all comments ({commentIds.length})
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
          !selectedComment &&
          this.renderAnnotationSortBy({
            engagementTab,
            commentSortBy,
            annotationSortBy
          })}
        {selectedAnnotations &&
          !selectedAnnotations.length &&
          !selectedComment && (
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
