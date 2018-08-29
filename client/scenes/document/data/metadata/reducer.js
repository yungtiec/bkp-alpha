import {cloneDeep} from "lodash";
import * as types from "./actionTypes";


const initialState = {};

const addVotesToDocument = (action, state) => {
  var newState = cloneDeep(state);
  newState.document.downvotesFrom = action.downvotesFrom;
  newState.document.upvotesFrom = action.upvotesFrom;
  return newState
}

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_SURVEY_METADATA_FETCH_SUCCESS:
      return {
        ...state,
        ...action.versionMetadata
      };
    case types.SURVEY_VOTED:
      return addVotesToDocument(action, state)
    default:
      return state;
  }
}

export function getVersionMetadata(state) {
  return state.scenes.document.data.metadata;
}

