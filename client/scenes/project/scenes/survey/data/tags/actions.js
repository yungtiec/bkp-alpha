import * as annotationTypes from "../annotations/actionTypes";
import * as types from "./actionTypes";
import { deleteTag, putTag } from "./service";
import { cloneDeep } from "lodash";

export const updateTagFilter = tags => ({
  type: types.TAG_FILTER_UPDATE,
  tags
});

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
        type: annotationTypes.ANNOTATION_TAG_REMOVED,
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
        type: annotationTypes.ANNOTATION_TAG_ADDED,
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
