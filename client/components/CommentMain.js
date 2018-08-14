import "./CommentMain.scss";
import React from "react";
import { Link } from "react-router-dom";
import history from "../history";
import moment from "moment";
import Avatar from "react-avatar";

export default ({ comment, path, children }) => (
  <div className="main-comment__main">
    <div
      className={`main-comment__header ${
        comment.version ? "main-comment__header--mobile" : ""
      }`}
    >
      {comment.version && comment.version.document ? (
        <div>
          <span className="main-comment__document-title">
            {comment.version.document.project.name}:{" "}
            {comment.version.document.title}
          </span>
        </div>
      ) : (
        <p className="main-comment__user">
          {comment.owner && (
            <span>
              <Avatar name={comment.owner.displayName} color={"#999999"} size={40} />
            </span>
          )}
          <span>{moment(comment.createdAt).fromNow()}</span>
        </p>
      )}
      <p>
        {comment.issue && (
          <span
            className={`main-comment__review main-comment__review--issue-${
              comment.issue.open ? "open" : "close"
            }`}
          >
            {comment.issue.open ? "issue:open" : "issue:close"}
          </span>
        )}
        <span
          className={`main-comment__review main-comment__review--${
            comment.reviewed
          }`}
        >
          {comment.reviewed}
        </span>
      </p>
    </div>
    {comment.version &&
      comment.version.document && (
        <p className="main-comment__user">
          {comment.owner && (
            <span>
              <Avatar name={comment.owner.displayName} color={"#999999"} size={40} />
            </span>
          )}
          <span>{moment(comment.createdAt).fromNow()}</span>
        </p>
      )}
    <p className="main-comment__quote">{comment.quote}</p>
    <p className="main-comment__comment">{comment.comment}</p>
    <div className="main-comment__tags">
      {comment.tags && comment.tags.length
        ? comment.tags.map(tag => (
            <span
              key={`comment-${comment.id}__tag-${tag.name}`}
              className="badge badge-light"
            >
              {tag.name}
              {"  "}
            </span>
          ))
        : ""}
    </div>
    <div className="main-comment__action--bottom">
      <div />
      {children}
    </div>
  </div>
);
