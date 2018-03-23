import { getAnnotationsBySurvey, postReplyToAnnotation } from "./service";
import * as types from "./actionTypes";
import { keyBy, omit, assignIn, pick } from "lodash";

export const fetchAnnotationsBySurvey = uri => {
  return async dispatch => {
    try {
      const annotations = await getAnnotationsBySurvey(uri);

      const annotationsById = keyBy(annotations, "id");
      dispatch({
        type: types.ANNOTATIONS_FETCH_SUCCESS,
        annotationsById
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const addNewAnnotationSentFromServer = annotation => ({
  type: types.ANNOTATION_ADDED,
  annotation
});

export const initiateReplyToAnnotation = ({ accessors, parent }) => ({
  type: types.ANNOTATION_REPLY_INIT,
  accessors,
  parent
});

export const replyToAnnotation = ({ parentId, comment }) => {
  return async (dispatch, getState) => {
    try {
      const rootAnnotation = await postReplyToAnnotation({
        parentId,
        comment
      });
      dispatch({
        type: types.ANNOTATION_UPDATED,
        rootAnnotation
      })
    } catch (err) {
      console.log(err);
    }
  };
};
