import _ from "lodash";
import * as types from "../actionTypes";

const initialState = {
  projectSurveysById: {},
  projectSurveyIds: [],
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_FETCH_SUCCESS:
      return {
        ...state,
        projectSurveysById: action.projectSurveysById,
        projectSurveyIds: action.projectSurveyIds
      }
    default:
      return state;
  }
}

export function getAllProjectSurveys(state) {
  return pick(state.scene.project.data.surveys, ["projectSurveysById", "projectSurveyIds"]);
}

