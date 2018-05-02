import {
  getAnnotationsBySurvey,
  postReplyToAnnotation,
  postUpvoteToAnnotation,
  updateAnnotationComment,
  postPendingAnnotationStatus,
  updateAnnotationIssueStatus
} from "./service";
import { getAllTags } from "../tags/service";
import { findItemInTreeById } from "../../../../../../utils";
import * as types from "./actionTypes";
import { keyBy, omit, assignIn, pick, cloneDeep, values } from "lodash";
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

export const initiateReplyToAnnotation = ({ accessors, parent }) => {
  return (dispatch, getState) => {
    const {
      annotationsById
    } = getState().scenes.project.scenes.survey.data.annotations;
    const ancestorIsSpam = accessors
      .map(aid => findItemInTreeById(values(annotationsById), aid))
      .reduce((bool, item) => item.reviewed === "spam" || bool, false);

    if (!ancestorIsSpam)
      dispatch({
        type: types.ANNOTATION_REPLY_INIT,
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

export const upvoteAnnotation = ({ itemId, hasUpvoted }) => {
  return async dispatch => {
    try {
      const { annotationId, upvotesFrom } = await postUpvoteToAnnotation({
        annotationId: itemId,
        hasUpvoted
      });
      dispatch({
        type: types.ANNOTATION_UPVOTED,
        annotationId,
        upvotesFrom
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const editAnnotationComment = ({
  annotationId,
  comment,
  tags,
  issueOpen
}) => {
  return async dispatch => {
    try {
      const rootAnnotation = await updateAnnotationComment({
        annotationId,
        comment,
        tags,
        issueOpen
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

export const changeAnnotationIssueStatus = annotationId => {
  return async (dispatch, getState) => {
    try {
      const annotation = getState().scenes.project.scenes.survey.data
        .annotations.annotationsById[annotationId];
      const user = getState().data.user;
      if (
        annotation.owner_id !== user.id &&
        !user.roles.filter(r => r.name === "admin").length
      )
        return;
      const open = annotation.issue ? !annotation.issue.open : true;

      await updateAnnotationIssueStatus({
        annotationId,
        open
      });
      dispatch({
        type: types.ANNOTATION_ISSUE_UPDATED,
        annotationId,
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
