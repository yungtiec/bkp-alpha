import { cloneDeep, flatten, countBy, keys } from "lodash";
import * as annotationTypes from "../annotations/actionTypes";
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
    case annotationTypes.ANNOTATIONS_FETCH_SUCCESS:
      return {
        ...state,
        allInServer: action.tags
      };
    case annotationTypes.ANNOTATION_TAG_ADDED:
      newState = cloneDeep(state);
      if (newState.allInServer.indexOf(action.tag) === -1)
        newState.allInServer.push(action.tag);
      return {
        ...state
      };
    case types.TAG_FILTER_UPDATE:
      return updateFilter(cloneDeep(state), action);
    default:
      return state;
  }
}

export function getAllTags(state) {
  return state.scenes.project.scenes.survey.data.tags.allInServer;
}

export function getCountsByTagName(state) {
  const {
    annotationsById,
    annotationIds
  } = state.scenes.project.scenes.survey.data.annotations;
  const allTags = flatten(
    annotationIds
      .filter(
        aid => annotationsById[aid].tags && annotationsById[aid].tags.length
      )
      .map(aid => annotationsById[aid].tags.map(tag => tag.name))
  );
  const countsByTagName = countBy(allTags);
  return countsByTagName;
}

export function getTagsWithCountInSurvey(state) {
  const countsByTagName = getCountsByTagName(state);
  return keys(countsByTagName).map(tagName => ({
    label: `${tagName} (${countsByTagName[tagName]})`,
    value: tagName
  }));
}

export function getTagFilter(state) {
  const countsByTagName = getCountsByTagName(state);
  const tagFilter = state.scenes.project.scenes.survey.data.tags.filter;
  return keys(tagFilter)
    .filter(tagName => tagFilter[tagName])
    .map(tagName => ({
      label: `${tagName} (${countsByTagName[tagName]})`,
      value: tagName
    }));
}
