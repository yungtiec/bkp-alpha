import React, { Component } from "react";
import autoBind from "react-autobind";
import { Link } from "react-router-dom";
import moment from "moment";
import { cloneDeep, isEmpty, find, orderBy, assignIn } from "lodash";
import { CommentBox } from "../index";
import { ActionableIssueTag, CommentItem } from "./index";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import policies from "../../../../../../policies.js";

export default ({
  comment,
  user,
  projectMetadata,
  isClosedForComment,
  isLoggedIn,
  upvoteItem,
  changeItemIssueStatus,
  initReply,
  promptLoginToast,
  openModal,
  labelAsSpam,
  labelAsNotSpam
}) => {
  const hasUpvoted = find(
    comment.upvotesFrom,
    upvotedUser => upvotedUser.id === user.id
  );
  return (
    <CommentItem
      containerClassName="comment-item__main"
      containerStyle={
        comment.descendents.length ? { borderBottom: "1px solid" } : {}
      }
      comment={comment}
      projectMetadata={projectMetadata}
      isClosedForComment={isClosedForComment}
      user={user}
      hasUpvoted={hasUpvoted}
      initReplyToThis={isLoggedIn ? () => initReply(comment) : promptLoginToast}
      upvoteItem={
        isLoggedIn
          ? () =>
              upvoteItem({
                rootId: null,
                comment,
                hasUpvoted
              })
          : promptLoginToast
      }
      openModal={() => openModal(comment, true, true)}
      labelAsSpam={labelAsSpam}
      labelAsNotSpam={labelAsNotSpam}
    >
      {comment.quote && <p className="comment-item__quote">{comment.quote}</p>}
      {(comment.tags && comment.tags.length) || comment.issue ? (
        <div className="comment-item__tags">
          <ActionableIssueTag
            comment={comment}
            changeItemIssueStatus={() => changeItemIssueStatus(comment)}
          />
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
      ) : null}
      <p className="comment-item__comment">{comment.comment}</p>
      {comment.issue && comment.issue.resolvingVersion ? (
        <span className="comment-item__issue-resolved">
          <Link
            to={`/project/${
              comment.issue.resolvingVersion.document.project.symbol
            }/document/${comment.issue.resolvingVersion.document.id}/version/${
              comment.issue.resolvingVersion.id
            }`}
          >{`issue resolved in document v${
            comment.issue.resolvingVersion.hierarchyLevel
          }`}</Link>
        </span>
      ) : null}
    </CommentItem>
  );
};
