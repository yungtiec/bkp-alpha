import * as types from "./actionTypes";
import { values, orderBy } from "lodash";
import moment from "moment";

const initialState = {
  annotationsById: {},
  annotationIds: []
};

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
    default:
      return state;
  }
}

export const getPendingAnnotations = state =>
  state.scenes.admin.data.pendingAnnotations;
