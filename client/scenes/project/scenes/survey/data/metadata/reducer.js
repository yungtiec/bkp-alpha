import _ from "lodash";
import * as types from "../actionTypes";

const initialState = {};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_SURVEY_FETCH_SUCCESS:
      return {
        ...state,
        ...action.surveyMetadata
      };
    case types.PROJECT_SURVEY_UPVOTED:
      return {
        ...state,
        upvotesFrom: action.upvotesFrom
      };
    case types.PROJECT_SURVEY_DOWNVOTED:
      return {
        ...state,
        downvotesFrom: action.downvotesFrom
      };
    default:
      return state;
  }
}

export function getSelectedSurvey(state) {
  return state.scenes.project.scenes.survey.data.metadata;
}
