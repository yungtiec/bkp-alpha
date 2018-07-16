import * as types from "../actionTypes";

const initialState = {
  surveysById: {},
  surveyIds: []
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_FETCH_SUCCESS:
      return {
        surveysById: action.surveysById,
        surveyIds: action.surveyIds
      };
    default:
      return state;
  }
}

export function getAllProjectSurveys(state) {
  return state.scenes.project.data.surveys
}
