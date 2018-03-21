import _ from "lodash";
import * as types from "./actionTypes";

const initialState = {
  annotationsById: {},
  annotationIds: []
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ANNOTATIONS_FETCH_SUCCESS:
      return {
        annotationsById: action.annotationsById,
        annotationIds: action.annotationIds
      };
    default:
      return state;
  }
}

export function getAllAnnotations(state) {
  return state.scenes.project.scenes.survey.data.annotations
}
