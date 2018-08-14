import * as commentTypes from "../comments/actionTypes";
import * as types from "./actionTypes";
import { deleteTag, putTag } from "./service";
import { cloneDeep } from "lodash";

export const updateTagFilter = tags => {
  return (dispatch, getState) => {
    dispatch({
      type: types.TAG_FILTER_UPDATED,
      tags
    });
  };
};

export const removeTag = ({ commentId, tagId }) => {
  return async (dispatch, getState) => {
    try {
      var comment = cloneDeep(
        getState().scenes.document.data.comments
          .commentsById[commentId]
      );
      await deleteTag({
        commentId,
        tagId
      });
      comment.tags = comment.tags.filter(tag => tag.id !== tagId);
      dispatch({
        type: commentTypes.COMMENT_TAG_REMOVED,
        comment
      });
      dispatch({
        type: "modal.UPDATE_MODAL_PROPS",
        modalProps: comment
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const addTag = ({ commentId, tagName }) => {
  return async (dispatch, getState) => {
    try {
      var comment = cloneDeep(
        getState().scenes.document.data.comments
          .commentsById[commentId]
      );
      var tag = await putTag({
        commentId,
        tagName
      });
      if (!comment.tags) comments.tags = [];
      comment.tags.push(tag);
      dispatch({
        type: commentTypes.COMMENT_TAG_ADDED,
        comment,
        tag
      });
      dispatch({
        type: "modal.UPDATE_MODAL_PROPS",
        modalProps: comment
      });
    } catch (err) {
      console.log(err);
    }
  };
};
