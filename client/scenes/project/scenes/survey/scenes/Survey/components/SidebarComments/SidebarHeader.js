import "./SidebarHeader.scss";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import autoBind from "react-autobind";
import Select from "react-select";
import { keys } from "lodash";
import { CommentBoxWithTagField, Countdown } from "../../../../components";

export default class SidebarHeader extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleSortByChange(selectedOption) {
    if (selectedOption.value !== this.props.commentSortBy) {
      this.props.sortCommentBy(selectedOption.value);
    }
  }

  renderCommentSortBy({ commentSortBy }) {
    return (
      <div
        className="social-sidebar__sort-by btn-group"
        role="group"
        aria-label="Basic example"
      >
        <span>sort by</span>
        <Select
          name="form-field-name"
          value={commentSortBy}
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
      selectedComments,
      commentIds,
      commentSortBy,
      tagsWithCountInSurvey,
      tagFilter,
      updateTagFilter,
      commentIssueFilter,
      tags,
      surveyMetadata,
      addNewComment,
      isClosedForComment
    } = this.props;

    return (
      <div>
        {selectedComments && !selectedComments.length ? (
          <div className="social-sidebar__engagement-tab-container">
            <p className="social-sidebar__engagement-tab">
              Comments ({commentIds.length})
            </p>
          </div>
        ) : (
          <div className="social-sidebar__engagement-tab-container">
            <p
              className="social-sidebar__engagement-tab active reset-selection"
              onClick={this.props.resetCommentSelection}
            >
              Show all Comments ({commentIds.length})
            </p>
          </div>
        )}
        {selectedComments &&
          !selectedComments.length &&
          this.renderCommentSortBy({
            commentSortBy
          })}
        {selectedComments &&
          !selectedComments.length && (
            <div className="social-sidebar__issue-filter-container">
              <span className="select-label">filter by issue</span>
              <Select
                name="social-sidebar__issue-filter"
                className="social-sidebar__issue-filter"
                placeholder="select issue status"
                multi={true}
                value={commentIssueFilter}
                onChange={this.handleIssueFilterChange}
                options={[
                  { value: "open", label: "open" },
                  { value: "closed", label: "closed" }
                ]}
              />
            </div>
          )}
        {selectedComments &&
          !selectedComments.length && (
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
        {selectedComments && !selectedComments.length ? (
          <div className="comment-item page-comment">
            <Countdown timeInUnix={Number(surveyMetadata.comment_until_unix)} />
            {!isClosedForComment ? (
              <CommentBoxWithTagField
                showTags={true}
                showIssueCheckbox={true}
                tags={tags}
                selectedTags={[]}
                initialValue=""
                projectSurveyId={surveyMetadata.id}
                onSubmit={addNewComment}
                onCancel={null}
              />
            ) : null}
          </div>
        ) : null}
        {!isLoggedIn &&
          !isClosedForComment && (
            <div className="comment-item">
              <div className="comment-item__main">
                <div className="comment-item__header">
                  <p>
                    <Link to="/login">Login</Link> or{" "}
                    <Link to="/signup">signup</Link> to comment
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  }
}
