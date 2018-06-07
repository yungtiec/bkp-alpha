import * as types from "./actionTypes";
import { keyBy, assignIn } from "lodash";
import {
  getComments,
  postPendingCommentStatus,
  updateCommentIssueStatus
} from "./service";
import { notify } from "reapop";

export function fetchComments(projectSurveyId) {
  return async dispatch => {
    try {
      var comments = await getComments(projectSurveyId);
      const commentsById = keyBy(comments, "id");
      dispatch({
        type: types.COMMENTS_FETCH_SUCCESS,
        commentsById
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

export function verifyPendingComment(comment, status) {
  return async dispatch => {
    try {
      await postPendingCommentStatus(comment, status);
      dispatch({
        type: types.COMMENT_VERIFIED_SUCCESS,
        comment: comment,
        status
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

export const changeCommentIssueStatus = comment => {
  return async (dispatch, getState) => {
    try {
      const user = getState().data.user;
      if (!user.roles.filter(r => r.name === "admin").length) return;
      const open = comment.issue ? !comment.issue.open : true;

      await updateCommentIssueStatus({
        comment,
        open
      });
      dispatch({
        type: types.COMMENT_ISSUE_UPDATED,
        comment,
        open
      });
    } catch (err) {
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
};
