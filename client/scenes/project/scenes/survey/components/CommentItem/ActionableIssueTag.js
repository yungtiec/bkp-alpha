import React, { Component } from "react";

export default ({ comment, changeItemIssueStatus }) =>
  comment.issue &&
  (comment.issue.open ? (
    <span
      key={`comment-${comment.id}__tag-issue--open`}
      className="badge badge-danger issue"
      onClick={changeItemIssueStatus}
    >
      issue:open
      <i className="fas fa-times" />
    </span>
  ) : (
    <span
      key={`comment-${comment.id}__tag-issue--close`}
      className="badge badge-light"
    >
      issue:close
    </span>
  ));
