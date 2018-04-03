import * as types from "./actionTypes";
import { keyBy, assignIn, omit, pick } from "lodash";
import { getPendingAnnotations } from "./service";
import { notify } from "reapop";

export function fetchPendingAnnotations() {
  return async dispatch => {
    try {
      const annotations = await getPendingAnnotations();
      const annotationsById = keyBy(annotations, "id");
      dispatch({
        type: types.PENING_ANNOTATIONS_FETCH_SUCCESS,
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
