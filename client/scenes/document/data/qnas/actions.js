import * as types from "./actionTypes";
import { getQuestionsByVersionId, postEditedQuestion } from "./services";
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
      var newlyAddedVersionQuestion = await postEditedQuestion({
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
      console.log(error)
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
