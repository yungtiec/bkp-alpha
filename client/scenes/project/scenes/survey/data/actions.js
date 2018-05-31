import * as types from "./actionTypes";
import { getSurveyByProjectSurveyId } from "./service";
import { keyBy, omit, assignIn, pick, sortBy } from "lodash";

export function fetchQuestionsByProjectSurveyId({ projectSurveyId }) {
  return async (dispatch, getState) => {
    try {
      var projectSurvey = await getSurveyByProjectSurveyId(projectSurveyId);
      const surveyQnas = sortBy(
        projectSurvey.survey.survey_questions,
        ["order_in_survey"],
        ["asc"]
      );
      const surveyQnasById = keyBy(surveyQnas, "id");
      const surveyQnaIds = surveyQnas.map(qna => qna.id);
      const surveyVersions = projectSurvey.ancestors
        .concat([pick(projectSurvey, ["id", "hierarchyLevel"])])
        .concat(projectSurvey.descendents);
      projectSurvey.versions = surveyVersions;
      const surveyMetadata = assignIn(
        pick(projectSurvey, [
          "title",
          "description",
          "id",
          "creator",
          "versions",
          "hierarchyLevel"
        ]),
        omit(projectSurvey.survey, ["survey_questions"])
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
