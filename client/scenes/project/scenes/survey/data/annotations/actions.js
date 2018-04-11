import {
  getAnnotationsBySurvey,
  postReplyToAnnotation,
  postUpvoteToAnnotation,
  postUpdatedCommentToAnnotation,
  postPendingAnnotationStatus,
  getAllTags,
  deleteTag,
  putTag
} from "./service";
import * as types from "./actionTypes";
import { keyBy, omit, assignIn, pick, cloneDeep } from "lodash";
import { notify } from "reapop";

export const fetchAnnotationsBySurvey = uri => {
  return async dispatch => {
    try {
      const annotations = await getAnnotationsBySurvey(uri);
      const tags = await getAllTags();
      const annotationsById = keyBy(annotations, "id");
      dispatch({
        type: types.ANNOTATIONS_FETCH_SUCCESS,
        annotationsById,
        tags
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

export const removeTag = ({ annotationId, tagId }) => {
  return async (dispatch, getState) => {
    try {
      var annotation = cloneDeep(
        getState().scenes.project.scenes.survey.data.annotations
          .annotationsById[annotationId]
      );
      await deleteTag({
        annotationId,
        tagId
      });
      annotation.tags = annotation.tags.filter(tag => tag.id !== tagId);
      dispatch({
        type: types.ANNOTATION_TAG_REMOVED,
        annotation
      });
      dispatch({
        type: "modal.UPDATE_MODAL_PROPS",
        modalProps: annotation
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const addTag = ({ annotationId, tagName }) => {
  return async (dispatch, getState) => {
    console.log(tagName);
    try {
      var annotation = cloneDeep(
        getState().scenes.project.scenes.survey.data.annotations
          .annotationsById[annotationId]
      );
      var tag = await putTag({
        annotationId,
        tagName
      });
      if (!annotation.tags) annotations.tags = [];
      annotation.tags.push(tag);
      dispatch({
        type: types.ANNOTATION_TAG_ADDED,
        annotation,
        tag
      });
      dispatch({
        type: "modal.UPDATE_MODAL_PROPS",
        modalProps: annotation
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
      dispatch({
        type: "modal.HIDE_MODAL"
      });
    } catch (err) {
      if (err.message.indexOf("code 500") !== -1) {
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
    }
  };
};

export const verifyAnnotationAsAdmin = (annotationId, reviewed) => {
  return async dispatch => {
    try {
      await postPendingAnnotationStatus({
        annotationId,
        reviewed
      });
      dispatch({
        type: types.ANNOTATION_VERIFIED,
        annotationId,
        reviewed
      });
    } catch (err) {
      console.log(err);
    }
  };
};
