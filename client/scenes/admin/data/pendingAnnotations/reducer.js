import * as types from "./actionTypes";

const initialState = {
  annotationsById: {},
  annotationIds: []
};

export default function reduce(state = initialState, action = {}) {
  var sortedAnnotations, annotationIds;
  switch (action.type) {
    case types.ANNOTATIONS_FETCH_SUCCESS:
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
