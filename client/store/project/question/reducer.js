import _ from "lodash";
import * as types from "../actionTypes";

const initialState = {
  surveyQnasById: {},
  surveyQnaIds: []
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.SURVEY_QUESTIONS_FETCHED:
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
  return state.project.question
}
