import * as types from "./actionTypes";
import { keyBy } from "lodash";
import { getPendingAnnotations, postPendingAnnotationStatus } from "./service";
import { notify } from "reapop";

export function fetchPendingAnnotations() {
  return async dispatch => {
    try {
      const annotations = await getPendingAnnotations();
      const annotationsById = keyBy(annotations, "id");
      dispatch({
        type: types.PENDING_ANNOTATIONS_FETCH_SUCCESS,
        annotationsById
      });
    } catch (error) {
      dispatch(
        notify({
          title: "Unauthorized requests",
          message: "",
          status: "error",
          dismissible: true,
          dismissAfter: 3000
        })
      );
    }
  };
}

export function verifyPendingAnnotation(annotationId, status) {
  return async dispatch => {
    try {
      await postPendingAnnotationStatus(annotationId, status);
      dispatch({
        type: types.PENDING_ANNOTATIONS_VERIFIED_SUCCESS,
        annotationId
      });
    } catch (error) {
      dispatch(
        notify({
          title: "Something went wrong",
          message: "Please try again later",
          status: "error",
          dismissible: true,
          dismissAfter: 3000
        })
      );
    }
  };
}
