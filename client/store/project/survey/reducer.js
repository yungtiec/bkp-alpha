import _ from "lodash";
import * as types from "../actionTypes";

const initialState = {
  projectSurveysById: {},
  projectSurveyIds: [],
  selectedId: ''
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_SURVEYS_FETCHED:
      return {
        ...state,
        projectSurveysById: action.projectSurveysById,
        projectSurveyIds: action.projectSurveyIds
      }
    case types.SURVEY_QUESTIONS_FETCHED:
      return {
        ...state,
        selectedId: action.selectedSurveyId
      };
    default:
      return state;
  }
}

export function getSelectedProjectSurvey(state) {
  if (state.project.survey.selectedId.length)
    return state.project.survey.projectSurveysById[state.project.survey.selectedId];
}

export function getAllProjectSurveys(state) {
  return pick(state.project.survey, ["projectSurveysById", "projectSurveyIds"]);
}

