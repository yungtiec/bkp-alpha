import {
  getCommentsBySurvey,
  postComment,
  postReplyToComment,
  postUpvoteToComment,
  postUpdatedCommentToComment,
  postPendingCommentStatus
} from "./service";
import * as types from "./actionTypes";
import { keyBy, omit, assignIn, pick, cloneDeep } from "lodash";
import { notify } from "reapop";

export const fetchCommentsBySurvey = projectSurveyId => {
  return async dispatch => {
    try {
      const comments = await getCommentsBySurvey(projectSurveyId);
      const commentsById = keyBy(comments, "id");
      dispatch({
        type: types.COMMENTS_FETCH_SUCCESS,
        commentsById: comments.length ? commentsById : {}
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const addNewComment = ({ projectSurveyId, comment }) => {
  return async dispatch => {
    try {
      const postedComment = await postComment({ projectSurveyId, comment });
      dispatch({
        type: types.COMMENT_ADDED,
        comment: postedComment
      });
    } catch (err) {
      console.log(err);
    }
  };
};

