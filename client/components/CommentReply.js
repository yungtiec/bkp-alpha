import "./CommentReply.scss";
import React from "react";
import { Link } from "react-router-dom";
import history from "../history";
import moment from "moment";
import Avatar from "react-avatar";

export default ({ comment, path, children }) => {
  const replier = comment.owner ? (
    <Avatar name={comment.owner.displayName} size={40} color={"#999999"} />
  ) : (
    "you"
  );

  const parent = comment.ancestors.slice(-1)[0];

  return (
    <div className="reply-comment__main">
      <div className="reply-comment__parent">
        <div
          className={`reply-comment__parent-header ${
            comment.project_survey ? "reply-comment__parent-header--mobile" : ""
          }`}
        >
          {comment.project_survey && comment.project_survey.survey ? (
            <div className="reply-comment__survey-title-container">
              <span className="reply-comment__survey-title">
                {comment.project_survey.project.name}:{" "}
                {comment.project_survey.survey.title}
              </span>
            </div>
          ) : (
            <p className="reply-comment__user">
              <span>
                <Avatar name={parent.owner.displayName} size={40} color={"#999999"} />
              </span>
              <span>{moment(parent.createdAt).fromNow()}</span>
            </p>
          )}
          <p>
            <span
              className={`reply-comment__review reply-comment__review reply-comment__review--${
                comment.reviewed
              }`}
            >
              {comment.reviewed}
            </span>
          </p>
        </div>
        {comment.project_survey &&
          comment.project_survey.survey && (
            <p className="reply-comment__user">
              <span>
                <Avatar name={parent.owner.displayName} size={40} color={"#999999"} />
              </span>
              <span>{moment(parent.createdAt).fromNow()}</span>
            </p>
          )}
        <p className="reply-comment__quote">{comment.quote}</p>
        <p className="reply-comment__comment">{parent.comment}</p>
        <div className="reply-comment__tags">
          {parent.tags && parent.tags.length
            ? parent.tags.map(tag => (
                <span
                  key={`comment-${parent.id}__tag-${tag.name}`}
                  className="badge badge-light"
                >
                  {tag.name}
                  {"  "}
                </span>
              ))
            : ""}
        </div>
      </div>

      <div className="reply-comment__reply">
        <p className="reply-comment__user">
          <span>
            {replier} replied {moment(comment.createdAt).fromNow()}
          </span>
        </p>
        <p className="reply-comment__comment">{comment.comment}</p>
      </div>

      <div className="reply-comment__action--bottom">
        <div />
        {children}
      </div>
    </div>
  );
};
