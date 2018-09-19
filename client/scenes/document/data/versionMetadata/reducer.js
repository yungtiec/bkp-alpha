import { cloneDeep, omit } from "lodash";
import * as types from "./actionTypes";

const initialState = {
  loading: false
};

const updateScorecard = (action, state) => {
  var newState = cloneDeep(state);
  newState.scorecard = action.scorecard;
  return newState;
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_SURVEY_METADATA_FETCH_REQUEST:
      return {
        ...state,
        loading: true
      };
    case types.PROJECT_SURVEY_METADATA_FETCH_SUCCESS:
      return {
        ...state,
        ...action.versionMetadata,
        loading: false
      };
    case types.VERSION_SCORECARD_UPDATED:
      return updateScorecard(action, state);
    default:
      return state;
  }
}

export function getVersionMetadata(state) {
  return {
    versionMetadata: omit(
      state.scenes.document.data.versionMetadata,
      "loading"
    ),
    versionMetadataLoading: state.scenes.document.data.versionMetadata.loading
  };
}
