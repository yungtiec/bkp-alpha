import React, { Component } from "react";
import autoBind from "react-autobind";
import { Link } from "react-router-dom";
import moment from "moment";
import { cloneDeep, isEmpty, find, orderBy, assignIn } from "lodash";
import { CommentBox } from "../index";
import { ActionBar } from "./index";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import policies from "../../../../../../policies.js";

export default ({
  children,
  containerClassName,
  containerStyle,
  comment,
  projectMetadata,
  isClosedForComment,
  user,
  hasUpvoted,
  initReplyToThis,
  upvoteItem,
  openModal,
  labelAsSpam,
  labelAsNotSpam
}) => {
  const wasEdited = comment.createdAt === comment.updatedAt;
  console.log(wasEdited);
  console.log(children);
  return (<div className={containerClassName} style={containerStyle || {}}>
    <div class="mt-3 comment-item__header">
      <p className="comment-item__owner-name d-flex flex-direction-column">
        <PunditContainer policies={policies} user={comment.owner}>
          <PunditTypeSet type="Comment">
            <VisibleIf
              action="isProjectAdmin"
              model={{ project: projectMetadata, comment }}
            >
              <span class="text-primary">
                <i class="text-primary mr-2 fas fa-certificate" />
                {`${comment.owner.displayName} (from ${
                  projectMetadata.symbol
                })`}
              </span>
            </VisibleIf>
          </PunditTypeSet>
        </PunditContainer>
        <PunditContainer policies={policies} user={comment.owner}>
          <PunditTypeSet type="Comment">
            <VisibleIf
              action="isNotProjectAdmin"
              model={{ project: projectMetadata, comment }}
            >
              <span>{comment.owner.displayName}</span>
            </VisibleIf>
          </PunditTypeSet>
        </PunditContainer>
      </p>
      <p>{moment(comment.createdAt).fromNow()}</p>
    </div>
    {children}
    <ActionBar
      item={comment}
      isClosedForComment={isClosedForComment}
      projectMetadata={projectMetadata}
      user={user}
      hasUpvoted={hasUpvoted}
      initReplyToThis={initReplyToThis}
      upvoteItem={upvoteItem}
      openModal={openModal}
      labelAsSpam={() => labelAsSpam(comment, null)}
      labelAsNotSpam={() => labelAsNotSpam(comment, null)}
    />
  </div>
)};
