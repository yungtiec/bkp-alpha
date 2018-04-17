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
import moment from "moment";

const initialState = {
  commentsById: {},
  commentIds: []
};

const sortFns = {
  timestamp: sortCommentsByTimestamp,
  upvotes: sortCommentsByUpvotes,
};

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

function addNewCommentSentFromServer({ state, comment }) {
  state.commentsById[comment.id] = comment;
  state.commentIds = keys(state.commentsById);
  return state;
}

export default function reduce(state = initialState, action = {}) {
  var sortedAnnotations, annotationIds;
  switch (action.type) {
    case types.COMMENTS_FETCH_SUCCESS:
      return {
        commentsById: action.commentsById,
        commentIds: keys(action.commentsById)
      };

    case types.COMMENT_ADDED:
      return addNewCommentSentFromServer({
        state: cloneDeep(state),
        comment: action.comment
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
    return assignIn(
      { unix: moment(comment.createdAt).format("X") },
      comment
    );
  });
  var sortedComments = sortFn(commentCollection);
  var sortedCommentIds = sortedComments.map(a => a.id);
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
      aid => commentsById[aid].reviewed === verificationStatus
    );
    return {
      commentIds: filteredCommentIds,
      commentsById,
      unfilteredCommentIds: sortedCommentIds
    };
  }
}
