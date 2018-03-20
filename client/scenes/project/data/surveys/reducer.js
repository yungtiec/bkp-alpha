import * as types from "../actionTypes";

const initialState = {
  projectSurveysById: {},
  projectSurveyIds: []
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_FETCH_SUCCESS:
      return {
        projectSurveysById: action.projectSurveysById,
        projectSurveyIds: action.projectSurveyIds
      };
    default:
      return state;
  }
}

export function getAllProjectSurveys(state) {
  return state.scenes.project.data.surveys
}
