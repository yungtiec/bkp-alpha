import { cloneDeep, flatten, countBy, keys } from "lodash";
import * as commentTypes from "../comments/actionTypes";
import * as types from "./actionTypes";

const initialState = {
  allInServer: [],
  filter: {}
};

const updateFilter = (state, action) => {
  if (action.tags.length) {
    keys(state.filter).forEach(tag => {
      state.filter[tag] = false;
    });
    action.tags.forEach(tag => {
      state.filter[tag.value] = true;
    });
  } else {
    keys(state.filter).forEach(tag => {
      state.filter[tag] = false;
    });
  }
  return state;
};

export default function reduce(state = initialState, action = {}) {
  var newState;
  switch (action.type) {
    case commentTypes.COMMENTS_FETCH_SUCCESS:
      return {
        ...state,
        allInServer: action.tags
      };
    case commentTypes.COMMENT_TAG_ADDED:
      newState = cloneDeep(state);
      if (newState.allInServer.indexOf(action.tag) === -1)
        newState.allInServer.push(action.tag);
      return {
        ...state
      };
    case types.TAG_FILTER_UPDATED:
      return updateFilter(cloneDeep(state), action);
    default:
      return state;
  }
}

export function getAllTags(state) {
  return state.scenes.document.data.tags.allInServer;
}

export function getCountsByTagName(state) {
  const {
    commentsById,
    commentIds
  } = state.scenes.document.data.comments;
  if (!commentIds) return {};
  const allTags = flatten(
    commentIds
      .filter(aid => commentsById[aid].tags && commentsById[aid].tags.length)
      .map(aid => commentsById[aid].tags.map(tag => tag.name))
  );
  const countsByTagName = countBy(allTags);
  return countsByTagName;
}

export function getTagsWithCountInDocument(state) {
  const countsByTagName = getCountsByTagName(state);
  return keys(countsByTagName).map(tagName => ({
    label: `${tagName} (${countsByTagName[tagName]})`,
    value: tagName
  }));
}

export function getTagFilter(state) {
  const countsByTagName = getCountsByTagName(state);
  const tagFilter = state.scenes.document.data.tags.filter;
  return keys(tagFilter)
    .filter(tagName => tagFilter[tagName])
    .map(tagName => ({
      label: `${tagName} (${countsByTagName[tagName] || "0"})`,
      value: tagName
    }));
}
