import * as types from "./actionTypes";
import {
  getQuestionsByVersionId,
  getLatestQuestionsByDocumentId,
  postEditedQuestion,
  postEditedAnswer,
  putQuestionVersion,
  putAnswerVersion
} from "./services";
import { keyBy, omit, sortBy, maxBy } from "lodash";
import { notify } from "reapop";

export function fetchLatestQuestionsByDocumentId(documentId) {
  return async (dispatch, getState) => {
    try {
      var version = await getLatestQuestionsByDocumentId(documentId);
      const versionQnas = sortBy(
        version.version_questions,
        ["order_in_version"],
        ["asc"]
      );
      const versionQnasById = keyBy(versionQnas, "id");
      const versionQnaIds = versionQnas.map(qna => qna.id);
      dispatch({
        type: types.VERSION_QUESTIONS_FETCH_SUCCESS,
        versionQnasById,
        versionQnaIds
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function fetchQuestionsByVersionId(versionId) {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: types.VERSION_QUESTIONS_FETCH_REQUEST
      });
      var version = await getQuestionsByVersionId(versionId);
      const versionQnas = sortBy(
        version.version_questions,
        ["order_in_version"],
        ["asc"]
      );
      const versionQnasById = keyBy(versionQnas, "id");
      const versionQnaIds = versionQnas.map(qna => qna.id);
      dispatch({
        type: types.VERSION_QUESTIONS_FETCH_SUCCESS,
        versionQnasById,
        versionQnaIds
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function toggleQuestionEditor({ versionQuestionId }) {
  return async dispatch => {
    try {
      dispatch({
        type: types.VERSION_QUESTION_EDITOR_IS_OPEN,
        versionQuestionId
      });
    } catch (error) {
      console.log(error);
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

export function toggleAnswerEditor({ versionQuestionId }) {
  return async dispatch => {
    try {
      dispatch({
        type: types.VERSION_ANSWER_EDITOR_IS_OPEN,
        versionQuestionId
      });
    } catch (error) {
      console.log(error);
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

export function editQuestion({ versionQuestionId, markdown }) {
  return async (dispatch, getState) => {
    try {
      const versionId = getState().scenes.document.data.versionMetadata.id;
      var newlyAddedVersionQuestion = await postEditedQuestion({
        versionId,
        versionQuestionId,
        markdown
      });
      dispatch({
        type: types.VERSION_QUESTION_EDITED,
        newlyAddedVersionQuestion,
        prevVersionQuestionId: versionQuestionId
      });
    } catch (error) {
      console.log(error);
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

export function revertToPrevQuestion({
  versionQuestionId,
  prevVersionQuestionId
}) {
  return async (dispatch, getState) => {
    try {
      const versionId = getState().scenes.document.data.versionMetadata.id;
      var versionQuestion = await putQuestionVersion({
        versionId,
        versionQuestionId,
        prevVersionQuestionId
      });
      dispatch({
        type: types.VERSION_QUESTION_REVERTED,
        prevVersionQuestionId,
        versionQuestion
      });
    } catch (error) {
      console.log(error);
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

export function editAnswer({ versionAnswerId, markdown, versionQuestionId }) {
  return async (dispatch, getState) => {
    try {
      const versionId = getState().scenes.document.data.versionMetadata.id;
      var newlyAddedVersionAnswer = await postEditedAnswer({
        versionId,
        versionAnswerId,
        markdown
      });
      dispatch({
        type: types.VERSION_ANSWER_EDITED,
        newlyAddedVersionAnswer,
        prevVersionAnswerId: versionAnswerId,
        versionQuestionId
      });
    } catch (error) {
      console.log(error);
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

export function revertToPrevAnswer({
  versionQuestionId,
  versionAnswerId,
  prevVersionAnswerId
}) {
  return async (dispatch, getState) => {
    try {
      const versionId = getState().scenes.document.data.versionMetadata.id;
      var versionAnswer = await putAnswerVersion({
        versionId,
        versionQuestionId,
        versionAnswerId,
        prevVersionAnswerId
      });
      dispatch({
        type: types.VERSION_ANSWER_REVERTED,
        versionAnswer,
        prevVersionAnswerId,
        versionQuestionId
      });
    } catch (error) {
      console.log(error);
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
