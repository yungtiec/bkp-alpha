import {
  cloneDeep,
  find,
  orderBy,
  values,
  isEmpty,
  keys,
  assignIn,
  filter
} from "lodash";
import * as types from "./actionTypes";
import { findItemInTreeById } from "../../../../../../utils";
import moment from "moment";

const initialState = {
  commentsById: {},
  commentIds: []
};

const sortFns = {
  timestamp: sortCommentsByTimestamp,
  upvotes: sortCommentsByUpvotes
};

function addNewCommentSentFromServer({ state, comment }) {
  state.commentsById[comment.id] = comment;
  state.commentIds = keys(state.commentsById);
  return state;
}

function removeEmptyCommentFromHierarchy({ state, accessors, parent }) {
  const rootComment = state.commentsById[accessors[0]];
  const anscestors = accessors.slice(1);
  if (!anscestors.length) {
    state.commentsById[accessors[0]].children = state.commentsById[
      accessors[0]
    ].children.filter(child => !isEmpty(child));
  } else {
    var current = rootComment;
    anscestors.filter(a => a).forEach(aid => {
      current = find(current.children, a => a.id === aid);
    });
    current.children = current.children.filter(child => !isEmpty(child));
  }
  return state;
}

function addEmptyCommentToHierarchy({ state, accessors, parent }) {
  const rootComment = state.commentsById[accessors[0]];
  const anscestors = accessors.slice(1);
  if (!anscestors.length) {
    // add empty annotation to root annotation
    if (!state.commentsById[accessors[0]].children)
      state.commentsById[accessors[0]].children = [];
    state.commentsById[accessors[0]].children.push({});
  } else {
    var current = rootComment;
    anscestors.forEach(aid => {
      current = find(current.children, a => a.id === aid);
    });
    if (!current.children) current.children = [];
    // add empty annotation to parent
    current.children.push({});
  }
  return state;
}

function reviewComment({ state, commentId, rootId, reviewed }) {
  var target;
  if (state.commentsById[commentId]) {
    // itself is root
    state.commentsById[commentId].reviewed = reviewed;
  } else {
    // its descendant(reply) to another annotation
    target = find(
      state.commentsById[rootId].descendents,
      a => a.id === commentId
    );
    target.reviewed = reviewed;
  }
  return state;
}

function updateUpvotesForComment({ state, commentId, rootId, upvotesFrom }) {
  var target;
  if (state.commentsById[commentId]) {
    // itself is root
    state.commentsById[commentId].upvotesFrom = upvotesFrom;
  } else {
    // its descendant(reply) to another annotation
    target = find(
      state.commentsById[rootId].descendents,
      a => a.id === commentId
    );
    target.upvotesFrom = upvotesFrom;
  }
  return state;
}

function updateCommentIssueStatus({ state, commentId, open }) {
  if (!state.commentsById[commentId].issue) {
    state.commentsById[commentId].issue = {};
  }
  state.commentsById[commentId].issue.open = open;
  return state;
}

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.COMMENTS_FETCH_SUCCESS:
      return {
        commentsById: action.commentsById,
        commentIds: keys(action.commentsById)
      };
    case types.COMMENT_REPLY_INIT:
      return addEmptyCommentToHierarchy({
        state: cloneDeep(state),
        accessors: action.accessors,
        parent: action.parent
      });
    case types.COMMENT_REPLY_CANCEL:
      return removeEmptyCommentFromHierarchy({
        state: cloneDeep(state),
        accessors: action.accessors,
        parent: action.parent
      });
    case types.COMMENT_ADDED:
      return addNewCommentSentFromServer({
        state: cloneDeep(state),
        comment: action.comment
      });
    case types.COMMENT_UPDATED:
      return addNewCommentSentFromServer({
        state: cloneDeep(state),
        comment: action.rootComment
      });
    case types.COMMENT_UPVOTED:
      return updateUpvotesForComment({
        state: cloneDeep(state),
        commentId: action.commentId,
        upvotesFrom: action.upvotesFrom
      });
    case types.COMMENT_VERIFIED:
      return reviewComment({
        state: cloneDeep(state),
        commentId: action.commentId,
        reviewed: action.reviewed
      });
    case types.COMMENT_ISSUE_UPDATED:
      return updateCommentIssueStatus({
        state: cloneDeep(state),
        commentId: action.commentId,
        open: action.open
      });
    default:
      return state;
  }
}

export function getAllComments(state) {
  const verificationStatus =
    state.scenes.project.scenes.survey.verificationStatus;
  const sortFn = sortFns[state.scenes.project.scenes.survey.commentSortBy];
  var {
    commentIds,
    commentsById
  } = state.scenes.project.scenes.survey.data.comments;
  const tagFilter = state.scenes.project.scenes.survey.data.tags.filter;
  const commentCollection = values(commentsById).map(comment => {
    return assignIn({ unix: moment(comment.createdAt).format("X") }, comment);
  });
  var sortedComments = sortFn(commentCollection);
  var sortedCommentIds = sortedComments
    .map(a => a.id)
    .filter(aid => commentsById[aid].reviewed !== "spam");
  var filteredCommentIds = filterByTags({
    tagFilter,
    commentIds: sortedCommentIds,
    commentsById
  });
  if (verificationStatus === "all") {
    return {
      unfilteredCommentIds: sortedCommentIds,
      commentIds: filteredCommentIds,
      commentsById
    };
  } else {
    filteredCommentIds = filteredCommentIds.filter(
      aid =>
        commentsById[aid].reviewed === verificationStatus &&
        commentsById[aid].reviewed !== "spam"
    );
    return {
      commentIds: filteredCommentIds,
      commentsById,
      unfilteredCommentIds: sortedCommentIds
    };
  }
}

function sortCommentsByTimestamp(commentCollection) {
  return orderBy(
    commentCollection,
    ["unix", "upvotesFrom.length"],
    ["desc", "desc"]
  );
}

function sortCommentsByUpvotes(commentCollection) {
  return orderBy(
    commentCollection,
    ["upvotesFrom.length", "unix"],
    ["desc", "desc"]
  );
}

function filterByTags({ tagFilter, commentsById, commentIds }) {
  var tagFilterArray = keys(tagFilter).filter(tag => tagFilter[tag]);
  if (!tagFilterArray.length) return commentIds;
  return filter(commentIds, cid => {
    return tagFilterArray.reduce((bool, tag) => {
      return (
        bool || commentsById[cid].tags.map(t => t.name).indexOf(tag) !== -1
      );
    }, false);
  });
}
