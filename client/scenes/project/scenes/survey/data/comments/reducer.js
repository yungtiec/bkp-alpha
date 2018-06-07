import {
  cloneDeep,
  find,
  orderBy,
  values,
  isEmpty,
  keys,
  assignIn,
  filter,
  flatten,
  maxBy
} from "lodash";
import * as types from "./actionTypes";
import moment from "moment";
import { findItemInTreeById } from "../../../../../../utils";

const initialState = {
  commentsById: null,
  commentIds: null
};

const sortFns = {
  timestamp: sortCommentsByTimestamp,
  upvotes: sortCommentsByUpvotes,
  position: sortCommentsByPosition
};

function removeEmptyCommentFromHierarchy({ state, accessors, parent }) {
  const rootComment = state.commentsById[accessors[0]];
  const anscestors = accessors.slice(1);
  if (!anscestors.length) {
    state.commentsById[accessors[0]].children = state.commentsById[
      accessors[0]
    ].children.filter(child => !isEmpty(child));
  } else {
    var current = rootComment;
    anscestors.filter(a => a).forEach(cid => {
      current = find(current.children, a => a.id === cid);
    });
    current.children = current.children.filter(child => !isEmpty(child));
  }
  return state;
}

function addEmptyCommentToHierarchy({ state, accessors, parent }) {
  const rootComment = state.commentsById[accessors[0]];
  const anscestors = accessors.slice(1);
  if (!anscestors.length) {
    // add empty comment to root comment
    if (!state.commentsById[accessors[0]].children)
      state.commentsById[accessors[0]].children = [];
    state.commentsById[accessors[0]].children.push({});
  } else {
    var current = rootComment;
    anscestors.forEach(cid => {
      current = find(current.children, a => a.id === cid);
    });
    if (!current.children) current.children = [];
    // add empty comment to parent
    current.children.push({});
  }
  return state;
}

function addNewCommentSentFromServer({ state, comment }) {
  state.commentsById[comment.id] = comment;
  state.commentIds = keys(state.commentsById);
  return state;
}

function reviewComment({ state, commentId, rootId, reviewed }) {
  var target;
  if (state.commentsById[commentId]) {
    // itself is root
    state.commentsById[commentId].reviewed = reviewed;
  } else {
    // its descendant(reply) to another comment
    target = find(
      state.commentsById[rootId].descendents,
      a => a.id === commentId
    );
    target.reviewed = reviewed;
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

function updateUpvotesForComment({
  state,
  commentId,
  rootId,
  upvotesFrom
}) {
  var target;
  if (state.commentsById[commentId]) {
    // itself is root
    state.commentsById[commentId].upvotesFrom = upvotesFrom;
  } else {
    // its descendant(reply) to another comment
    target = find(
      state.commentsById[rootId].descendents,
      a => a.id === commentId
    );
    target.upvotesFrom = upvotesFrom;
  }
  return state;
}

function removeTagFromComment({ state, comment }) {
  state.commentsById[comment.id] = comment;
  return state;
}

function addTagToComment({ state, comment }) {
  state.commentsById[comment.id] = comment;
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
        rootId: action.rootId,
        commentId: action.commentId,
        upvotesFrom: action.upvotesFrom
      });
    case types.COMMENT_VERIFIED:
      return reviewComment({
        state: cloneDeep(state),
        commentId: action.commentId,
        reviewed: action.reviewed,
        rootId: action.rootId
      });
    case types.COMMENT_ISSUE_UPDATED:
      return updateCommentIssueStatus({
        state: cloneDeep(state),
        commentId: action.commentId,
        open: action.open
      });
    case types.COMMENT_TAG_REMOVED:
      return removeTagFromComment({
        state: cloneDeep(state),
        comment: action.comment
      });
    case types.COMMENT_TAG_ADDED:
      return addTagToComment({
        state: cloneDeep(state),
        comment: action.comment
      });
    default:
      return state;
  }
}

/**
 *
 * filter tags
 *
 */

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

/**
 *
 * filter issue
 *
 */

function filterByIssue({
  commentIssueFilter,
  commentsById,
  commentIds
}) {
  if (!commentIssueFilter.length) return commentIds;
  return filter(commentIds, cid => {
    return commentIssueFilter.reduce((bool, issueStatus) => {
      return bool || issueStatus === "open"
        ? commentsById[cid].issue && commentsById[cid].issue.open
        : commentsById[cid].issue && !commentsById[cid].issue.open;
    }, false);
  });
}

/**
 *
 * sort fns
 *
 */

function sortCommentsByPosition(commentCollection) {
  if (!commentCollection.length) return [];
  return orderBy(
    commentCollection,
    ["range.order_in_survey", "range.startIndex", "range.endIndex"],
    ["asc", "asc", "asc"]
  );
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

function splitRangePath(path) {
  const paths = path.split("/").slice(1);
  const elements = paths.map(p => {
    var [element, order] = p.split("[");
    order = order.replace("]", "");
    if (element === "h5") return [1, Number(order)];
    if (element === "div") return [2, Number(order)];
    if (element === "p") return [3, Number(order)];
  });
  return flatten(elements);
}

function getStartAndEndIndexInSurveyQna(
  surveyQnaIds,
  surveyQnasById,
  comment
) {
  try {
    if (!surveyQnaIds.length) return;
    const surveyQuestion = surveyQnasById[comment.survey_question_id];
    const surveyQnaContent =
      surveyQuestion.question.markdown +
      surveyQuestion.project_survey_answers.reduce(
        (string, answer) => answer.markdown + " ",
        ""
      );
    const startIndex = surveyQnaContent.indexOf(comment.quote);
    const endIndex = startIndex + comment.quote.length;
    const order_in_survey = surveyQuestion.order_in_survey;
    return { startIndex, endIndex, order_in_survey };
  } catch (err) {}
}

/**
 *
 * selectors
 *
 */

export function getAllComments(state) {
  var filteredCommentIds;
  const verificationStatus =
    state.scenes.project.scenes.survey.verificationStatus;
  const sortFn = sortFns[state.scenes.project.scenes.survey.commentSortBy];
  var {
    commentIds,
    commentsById
  } = state.scenes.project.scenes.survey.data.comments;
  const tagFilter = state.scenes.project.scenes.survey.data.tags.filter;
  const commentIssueFilter =
    state.scenes.project.scenes.survey.commentIssueFilter;
  const {
    surveyQnaIds,
    surveyQnasById
  } = state.scenes.project.scenes.survey.data.qnas;
  const commentCollection = values(commentsById).map(comment => {
    const range = getStartAndEndIndexInSurveyQna(
      surveyQnaIds,
      surveyQnasById,
      comment
    );
    return assignIn(
      { unix: moment(comment.createdAt).format("X"), range },
      comment
    );
  });
  var sortedComments = sortFn(commentCollection);
  var sortedCommentIds = sortedComments
    .map(a => a.id)
    .filter(cid => commentsById[cid].reviewed !== "spam");
  filteredCommentIds = filterByTags({
    tagFilter,
    commentIds: sortedCommentIds,
    commentsById
  });
  filteredCommentIds = filterByIssue({
    commentIssueFilter,
    commentsById,
    commentIds: filteredCommentIds
  });
  if (verificationStatus === "all") {
    return {
      unfilteredCommentIds: sortedCommentIds,
      commentIds: filteredCommentIds,
      commentsById
    };
  } else {
    filteredCommentIds = filteredCommentIds.filter(
      cid =>
        commentsById[cid].reviewed === verificationStatus &&
        commentsById[cid].reviewed !== "spam"
    );
    return {
      commentIds: filteredCommentIds,
      commentsById,
      unfilteredCommentIds: sortedCommentIds
    };
  }
}

export const getOutstandingIssues = state => {
  const commentsById =
    state.scenes.project.scenes.survey.data.comments.commentsById;
  if (!commentsById) return null;
  const comments = values(commentsById)
    .filter(item => item.issue && item.issue.open)
    .map(item => assignIn({ unix: moment(item.createdAt).format("X") }, item));
  const outstandingIssues = orderBy(
    comments,
    ["upvotesFrom.length", "unix"],
    ["desc", "desc"]
  );
  return outstandingIssues;
};
