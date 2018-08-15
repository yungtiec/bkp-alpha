import React, { Component } from "react";

export default ({
  comment,
  labelAsSpam,
  labelAsNotSpam,
  changeCommentIssueStatus,
  seeCommentContext
}) => {
  return (
    <div className="btn-group" role="group" aria-label="Basic example">
      <button
        type="button"
        className="btn btn-outline-danger"
        onClick={() => labelAsSpam(comment)}
      >
        spam
      </button>
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => labelAsNotSpam(comment)}
      >
        verify
      </button>
      {comment.issue ? (
        comment.issue.open ? (
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={() => changeCommentIssueStatus(comment)}
          >
            close issue
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={() => changeCommentIssueStatus(comment)}
          >
            re-open issue
          </button>
        )
      ) : comment.hierarchyLevel === 1 ? (
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => changeCommentIssueStatus(comment)}
        >
          open issue
        </button>
      ) : null}
      <button
        type="button"
        className="btn btn-outline-secondary"
        disabled={comment.reviewed === "spam"}
        onClick={() => seeCommentContext(comment)}
      >
        see in context
      </button>
    </div>
  );
};
