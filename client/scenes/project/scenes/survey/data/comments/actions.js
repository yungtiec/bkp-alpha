import {
  getCommentsBySurvey,
  postReplyToComment,
  postUpvoteToComment,
  updateComment,
  postPendingCommentStatus,
  updateCommentIssueStatus,
  postComment
} from "./service";
import { getAllTags } from "../tags/service";
import { findItemInTreeById } from "../../../../../../utils";
import * as types from "./actionTypes";
import { keyBy, omit, assignIn, pick, cloneDeep, values } from "lodash";
import { notify } from "reapop";
import history from "../../../../../../history";

export const fetchCommentsBySurvey = ({ projectSymbol, projectSurveyId }) => {
  return async dispatch => {
    try {
      const comments = await getCommentsBySurvey(
        projectSymbol,
        projectSurveyId
      );
      const tags = await getAllTags();
      const commentsById = keyBy(comments, "id");
      dispatch({
        type: types.COMMENTS_FETCH_SUCCESS,
        commentsById,
        tags
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const addNewComment = ({
  projectSurveyId,
  newComment,
  tags,
  issueOpen
}) => {
  return async (dispatch, getState) => {
    try {
      const projectSymbol = getState().scenes.project.data.metadata.symbol;
      const postedComment = await postComment({
        projectSymbol,
        projectSurveyId,
        newComment,
        tags,
        issueOpen
      });
      dispatch({
        type: types.COMMENT_ADDED,
        comment: postedComment
      });
      history.push(
        `/project/${projectSymbol}/survey/${projectSurveyId}/comment/${
          postedComment.id
        }`
      );
    } catch (err) {
      console.log(err);
    }
  };
};

export const addNewCommentSentFromServer = comment => {
  return (dispatch, getState) => {
    try {
      const projectSymbol = getState().scenes.project.data.metadata.symbol;
      const projectSurveyId = getState().scenes.project.scenes.survey.data.metadata
        .id;
      dispatch({
        type: types.COMMENT_ADDED,
        comment
      });
      history.push(
        `/project/${projectSymbol}/survey/${projectSurveyId}/comment/${
          comment.id
        }`
      );
    } catch (err) {
      console.log(err);
    }
  };
};

export const initiateReplyToComment = ({ accessors, parent }) => {
  return (dispatch, getState) => {
    const {
      commentsById
    } = getState().scenes.project.scenes.survey.data.comments;
    const ancestorIsSpam = accessors
      .map(aid => findItemInTreeById(values(commentsById), aid))
      .reduce((bool, item) => item.reviewed === "spam" || bool, false);

    if (!ancestorIsSpam)
      dispatch({
        type: types.COMMENT_REPLY_INIT,
        accessors,
        parent
      });
    else
      dispatch(
        notify({
          title: "Something went wrong",
          message: "Can't reply to spam message",
          status: "error",
          dismissible: true,
          dismissAfter: 3000
        })
      );
  };
};

export const cancelReplyToComment = ({ accessors, parent }) => ({
  type: types.COMMENT_REPLY_CANCEL,
  accessors,
  parent
});

export const replyToComment = ({
  rootId,
  parentId,
  newComment,
  projectSurveyId
}) => {
  return async (dispatch, getState) => {
    try {
      const rootComment = await postReplyToComment({
        projectSymbol: getState().scenes.project.data.metadata.symbol,
        projectSurveyId,
        rootId,
        parentId,
        newComment
      });
      dispatch({
        type: types.COMMENT_UPDATED,
        rootComment
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const upvoteComment = ({ rootId, comment, hasUpvoted }) => {
  return async (dispatch, getState) => {
    try {
      const { commentId, upvotesFrom } = await postUpvoteToComment({
        projectSymbol: getState().scenes.project.data.metadata.symbol,
        projectSurveyId: comment.project_survey_id,
        commentId: comment.id,
        hasUpvoted
      });
      dispatch({
        type: types.COMMENT_UPVOTED,
        commentId,
        rootId,
        upvotesFrom
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const editComment = ({
  projectSurveyId,
  commentId,
  newComment,
  tags,
  issueOpen
}) => {
  return async (dispatch, getState) => {
    try {
      const rootComment = await updateComment({
        projectSymbol: getState().scenes.project.data.metadata.symbol,
        projectSurveyId,
        commentId,
        newComment,
        tags,
        issueOpen
      });
      dispatch({
        type: types.COMMENT_UPDATED,
        rootComment
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

export const verifyCommentAsAdmin = ({ comment, rootId, reviewed }) => {
  return async dispatch => {
    try {
      await postPendingCommentStatus({
        comment,
        reviewed
      });
      dispatch({
        type: types.COMMENT_VERIFIED,
        commentId: comment.id,
        reviewed,
        rootId
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

export const changeCommentIssueStatus = comment => {
  return async (dispatch, getState) => {
    try {
      const user = getState().data.user;
      const open = comment.issue ? !comment.issue.open : true;
      await updateCommentIssueStatus({
        comment,
        open
      });
      dispatch({
        type: types.COMMENT_ISSUE_UPDATED,
        commentId: comment.id,
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
