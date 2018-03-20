import * as types from "./actionTypes";
import { getProjectBySymbol } from "./service";
import { keyBy, omit, assignIn, pick } from "lodash";

export function fetchQuestionsBySurveyId({ projectSymbol, surveyId }) {
  return async (dispatch, getState) => {
    try {
      const project = await getProjectBySymbol(projectSymbol);
      const projectSurveysById = keyBy(project.project_surveys, "id");
      const surveyQnas = projectSurveysById[surveyId].survey.survey_questions;
      const surveyQnasById = keyBy(surveyQnas, "id");
      const surveyQnaIds = surveyQnas.map(qna => qna.id);
      const surveyMetadata = assignIn(
        pick(projectSurveysById[surveyId], ["name", "id"]),
        omit(projectSurveysById[surveyId].survey, ["survey_questions", "id"])
      );
      dispatch({
        type: types.SURVEY_FETCH_SUCCESS,
        surveyQnasById,
        surveyQnaIds,
        surveyMetadata
      });
    } catch (error) {
      console.error(error);
    }
  };
}
