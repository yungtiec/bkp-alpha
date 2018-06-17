import _ from "lodash";
import * as types from "../actionTypes";

const initialState = {
  surveyQnasById: {},
  surveyQnaIds: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_SURVEY_FETCH_SUCCESS:
      return {
        ...state,
        surveyQnasById: action.surveyQnasById,
        surveyQnaIds: action.surveyQnaIds
      };
    default:
      return state;
  }
}

export function getAllSurveyQuestions(state) {
  return state.scenes.project.scenes.survey.data.qnas
}
