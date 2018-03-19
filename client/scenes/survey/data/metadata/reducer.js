import _ from "lodash";
import * as types from "../actionTypes";

const initialState = {};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.SURVEY_FETCH_SUCCESS:
      return {
        ...state,
        ...action.surveyMetadata
      }
    default:
      return state;
  }
}

export function getSelectedProject(state) {
  return state.scene.survey.data.metadata
}

