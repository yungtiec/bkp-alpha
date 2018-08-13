import React from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarContents from "./SidebarContents";
import { Element } from "react-scroll";

export default ({
  isLoggedIn,
  anonymity,
  commentIds,
  commentsById,
  nonSpamCommentIds,
  surveyMetadata,
  projectMetadata,
  commentSortBy,
  sortCommentBy,
  tags,
  tagFilter,
  updateTagFilter,
  tagsWithCountInSurvey,
  commentIssueFilter,
  updateIssueFilter,
  isClosedForComment,
  addNewComment,
  selectedComments,
  selectedText,
  resetCommentSelection,
  parent
}) => (
  <Element
    name="sidebar-contents"
    id="sidebar-contents"
    className="sidebar-contents"
  >
    <SidebarHeader
      commentSortBy={commentSortBy}
      sortCommentBy={sortCommentBy}
      nonSpamCommentIds={nonSpamCommentIds}
      selectedComments={selectedComments}
      tagFilter={tagFilter}
      updateTagFilter={updateTagFilter}
      tagsWithCountInSurvey={tagsWithCountInSurvey}
      isLoggedIn={isLoggedIn}
      anonymity={anonymity}
      isClosedForComment={isClosedForComment}
      resetCommentSelection={resetCommentSelection}
      commentIssueFilter={commentIssueFilter}
      updateIssueFilter={updateIssueFilter}
      tags={tags}
      surveyMetadata={surveyMetadata}
      addNewComment={addNewComment}
    />
    <SidebarContents
      isLoggedIn={isLoggedIn}
      commentIds={commentIds}
      commentsById={commentsById}
      selectedText={selectedText}
      selectedComments={selectedComments}
      projectMetadata={projectMetadata}
      tags={tags}
      parent={parent}
    />
  </Element>
);
