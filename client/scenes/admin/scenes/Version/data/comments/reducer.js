import * as types from "./actionTypes";
import {
  values,
  orderBy,
  clone,
  keys,
  cloneDeep,
  assignIn,
  groupBy,
  filter,
  flow
} from "lodash";
import moment from "moment";
import { findItemInTreeById } from "../../../../../../utils";

const initialState = {
  commentsById: {},
  commentIds: []
};

function addComments(state, action) {
  const sortedComments = orderBy(
    keys(action.commentsById).map(cid => ({
      id: cid,
      unix: parseInt(moment(action.commentsById[cid].updatedAt).format("X"))
    })),
    ["unix"],
    ["desc"]
  );
  const commentIds = sortedComments.map(a => a.id);
  return {
    commentsById: action.commentsById,
    commentIds
  };
}

function updateCommentStatus(state, action) {
  var target = findItemInTreeById(
    values(state.commentsById),
    action.comment.id,
    "id"
  );
  target.reviewed = action.status;
  return {
    ...state
  };
}

function updateCommentIssueStatus(state, action) {
  if (!state.commentsById[action.comment.id].issue) {
    state.commentsById[action.comment.id].issue = {};
  }
  state.commentsById[action.comment.id].issue.open = action.open;
  return state;
}

export default function reduce(state = initialState, action = {}) {
  var sortedComments, commentIds;
  switch (action.type) {
    case types.COMMENTS_FETCH_SUCCESS:
      return addComments(cloneDeep(state), action);
    case types.COMMENT_VERIFIED_SUCCESS:
      return updateCommentStatus(cloneDeep(state), action);
    case types.COMMENT_ISSUE_UPDATED:
      return updateCommentIssueStatus(cloneDeep(state), action);
    default:
      return state;
  }
}

export const getComments = state => {
  const filterDict = {
    verified: "reviewStatus",
    spam: "reviewStatus",
    pending: "reviewStatus",
    open: "issueStatus",
    closed: "issueStatus"
  };
  const {
    commentsById,
    commentIds
  } = state.scenes.admin.scenes.version.data.comments;
  const checked = state.scenes.admin.scenes.version.checked;
  const checkedDict = groupBy(
    checked.map(c => ({
      filter: filterDict[c],
      value: c
    })),
    "filter"
  );
  const filterByReviewStatusBound = filterByReviewStatus.bind(
    null,
    (checkedDict.reviewStatus && checkedDict.reviewStatus.map(c => c.value)) ||
      [],
    commentsById
  );
  const filterByIssueStatusBound = filterByIssueStatus.bind(
    null,
    (checkedDict.issueStatus && checkedDict.issueStatus.map(c => c.value)) ||
      [],
    commentsById
  );
  const filters = flow([filterByReviewStatusBound, filterByIssueStatusBound]);
  const filteredCommentIds = filters(_.keys(commentsById));
  return {
    commentIds: filteredCommentIds,
    commentsById
  };
};

function filterByReviewStatus(statusArr, commentsById, commentsIds) {
  if (!statusArr || !statusArr.length) return commentsIds;
  return filter(commentsIds, commentId => {
    return statusArr.indexOf(commentsById[commentId].reviewed) !== -1;
  });
}

function filterByIssueStatus(issueStatusArr, commentsById, commentsIds) {
  if (!issueStatusArr || !issueStatusArr.length) return commentsIds;
  return filter(commentsIds, commentId => {
    const issueStatus = !commentsById[commentId].issue
      ? "none"
      : commentsById[commentId].issue.open ? "open" : "closed";
    return issueStatusArr.indexOf(issueStatus) !== -1;
  });
}
