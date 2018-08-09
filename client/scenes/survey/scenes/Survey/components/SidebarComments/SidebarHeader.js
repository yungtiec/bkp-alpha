import "./SidebarHeader.scss";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import autoBind from "react-autobind";
import Select from "react-select";
import { keys } from "lodash";
import { CommentBoxWithTagField, Countdown } from "../index";

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
        className="sidebar__sort-by btn-group"
        role="group"
        aria-label="Basic example"
      >
        <span>sort comments by</span>
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
          <div className="sidebar__title-container">
            <p className="sidebar__title">Comments ({commentIds.length})</p>
          </div>
        ) : (
          <div className="sidebar__title-container">
            <p
              className="sidebar__title active reset-selection"
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
        {selectedComments && !selectedComments.length && isLoggedIn ? (
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
            <div className="comment-item mt-4">
              <div className="comment-item__main">
                <div className="comment-item__header">
                  <p className="mb-0">
                    <Link to="/login" className="text-primary">
                      Login
                    </Link>{" "}
                    or{" "}
                    <Link to="/signup" className="text-primary">
                      signup
                    </Link>{" "}
                    to comment
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  }
}
