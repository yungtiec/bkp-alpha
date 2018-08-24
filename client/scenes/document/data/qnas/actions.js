import * as types from "./actionTypes";
import {
  getQuestionsByVersionId,
  postEditedQuestion,
  postEditedAnswer,
  postQuestionVersion,
  postAnswerVersion
} from "./services";
import { keyBy, omit, sortBy } from "lodash";
import { notify } from "reapop";

export function fetchQuestionsByVersionId(versionId) {
  return async (dispatch, getState) => {
    try {
      var version = await getQuestionsByVersionId(versionId);
      const documentQnas = sortBy(
        version.version_questions,
        ["order_in_version"],
        ["asc"]
      );
      const documentQnasById = keyBy(documentQnas, "id");
      const documentQnaIds = documentQnas.map(qna => qna.id);
      dispatch({
        type: types.PROJECT_SURVEY_QUESTIONS_FETCH_SUCCESS,
        documentQnasById,
        documentQnaIds
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function editQuestion({ versionQuestionId, markdown }) {
  return async (dispatch, getState) => {
    try {
      const versionId = getState().scenes.document.data.metadata.id;
      var newlyAddedVersionQuestion = await postEditedQuestion({
        versionId,
        versionQuestionId,
        markdown,
        reverting: false
      });
      dispatch({
        type: types.PROJECT_SURVEY_QUESTION_EDITED,
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
      const versionId = getState().scenes.document.data.metadata.id;
      var versionQuestion = await postQuestionVersion({
        versionId,
        versionQuestionId,
        prevVersionQuestionId,
        reverting: true
      });
      dispatch({
        type: types.PROJECT_SURVEY_QUESTION_REVERTED,
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
      const versionId = getState().scenes.document.data.metadata.id;
      var newlyAddedVersionAnswer = await postEditedAnswer({
        versionId,
        versionAnswerId,
        markdown,
        reverting: false
      });
      dispatch({
        type: types.PROJECT_SURVEY_ANSWER_EDITED,
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
      const versionId = getState().scenes.document.data.metadata.id;
      var versionAnswer = await postAnswerVersion({
        versionId,
        versionQuestionId,
        versionAnswerId,
        prevVersionAnswerId,
        reverting: true
      });
      dispatch({
        type: types.PROJECT_SURVEY_ANSWER_REVERTED,
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
