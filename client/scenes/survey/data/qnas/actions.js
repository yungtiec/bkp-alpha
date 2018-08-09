import * as types from "./actionTypes";
import { getQuestionsByProjectSurveyId } from "./services";
import { keyBy, omit, sortBy } from "lodash";
import { notify } from "reapop";

export function fetchQuestionsByProjectSurveyId(projectSurveyId) {
  return async (dispatch, getState) => {
    try {
      var projectSurvey = await getQuestionsByProjectSurveyId(projectSurveyId);
      const surveyQnas = sortBy(
        projectSurvey.survey_questions,
        ["order_in_survey"],
        ["asc"]
      );
      const surveyQnasById = keyBy(surveyQnas, "id");
      const surveyQnaIds = surveyQnas.map(qna => qna.id);
      dispatch({
        type: types.PROJECT_SURVEY_QUESTIONS_FETCH_SUCCESS,
        surveyQnasById,
        surveyQnaIds
      });
    } catch (error) {
      console.error(error);
    }
  };
}
