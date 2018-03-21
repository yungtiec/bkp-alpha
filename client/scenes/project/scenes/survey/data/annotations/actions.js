import { getAnnotationsBySurvey } from "./service";
import * as types from "./actionTypes";
import { keyBy, omit, assignIn, pick } from "lodash";

export const fetchAnnotationsBySurvey = uri => {
  return async (dispatch) => {
    try {
      const annotations = await getAnnotationsBySurvey(uri)
      const annotationsById = keyBy(annotations, 'id')
      const annotationIds = annotations.map(a => a.id)
      dispatch({
        type: types.ANNOTATIONS_FETCH_SUCCESS,
        annotationsById,
        annotationIds
      })
    } catch (err) {
      console.log(err)
    }
  }
}
