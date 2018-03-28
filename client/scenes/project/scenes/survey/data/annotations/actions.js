import {
  getAnnotationsBySurvey,
  postReplyToAnnotation,
  postUpvoteToAnnotation,
  postUpdatedCommentToAnnotation
} from "./service";
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

export const cancelReplyToAnnotation = ({ accessors, parent }) => ({
  type: types.ANNOTATION_REPLY_CANCEL,
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
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const upvoteAnnotation = ({ annotationId, hasUpvoted }) => {
  return async dispatch => {
    try {
      const rootAnnotation = await postUpvoteToAnnotation({
        annotationId,
        hasUpvoted
      });
      dispatch({
        type: types.ANNOTATION_UPVOTED,
        rootAnnotation
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const editAnnotationComment = ({ annotationId, comment }) => {
  return async dispatch => {
    try {
      const rootAnnotation = await postUpdatedCommentToAnnotation({
        annotationId,
        comment
      });
      dispatch({
        type: types.ANNOTATION_UPDATED,
        rootAnnotation
      });
    } catch (err) {
      console.log(err);
    }
  };
};
