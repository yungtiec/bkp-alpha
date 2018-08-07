import { cloneDeep } from "lodash";
import * as types from "../actionTypes";

const labelDividerTitle = surveyQnasById => {
  for (var id in surveyQnasById) {
    const isDividerTitle =
      surveyQnasById[id].project_survey_answers.length === 1 &&
      !surveyQnasById[id].project_survey_answers[0].markdown.trim();
    surveyQnasById[id].isDividerTitle = isDividerTitle;
  }
  return surveyQnasById;
};

const initialState = {
  surveyQnasById: {},
  surveyQnaIds: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_SURVEY_FETCH_SUCCESS:
      return {
        ...state,
        surveyQnasById: labelDividerTitle(cloneDeep(action.surveyQnasById)),
        surveyQnaIds: action.surveyQnaIds
      };
    default:
      return state;
  }
}

export function getAllSurveyQuestions(state) {
  return state.scenes.project.scenes.survey.data.qnas;
}
