import * as types from "./actionTypes";
import { values, orderBy, clone, keys } from "lodash";
import moment from "moment";

const initialState = {
  annotationsById: {},
  annotationIds: []
};

function removePendingAnnotation(state, annotationId) {
  delete state.annotationsById[annotationId];
  return {
    ...state,
    annotationIds: keys(state.annotationsById)
  };
}

export default function reduce(state = initialState, action = {}) {
  var sortedAnnotations, annotationIds;
  switch (action.type) {
    case types.PENDING_ANNOTATIONS_FETCH_SUCCESS:
      sortedAnnotations = orderBy(
        values(action.annotationsById).map(a => ({
          id: a.id,
          unix: parseInt(moment("2018-10-31").format("X"))
        })),
        ["unix"],
        ["desc"]
      );
      annotationIds = sortedAnnotations.map(a => a.id);
      return {
        annotationsById: action.annotationsById,
        annotationIds
      };
    case types.PENDING_ANNOTATIONS_VERIFIED_SUCCESS:
      return removePendingAnnotation(clone(state), action.annotationId);
    default:
      return state;
  }
}

export const getPendingAnnotations = state =>
  state.scenes.admin.data.pendingAnnotations;
