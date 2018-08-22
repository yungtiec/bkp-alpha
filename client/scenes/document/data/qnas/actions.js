import * as types from "./actionTypes";
import { getQuestionsByVersionId } from "./services";
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
