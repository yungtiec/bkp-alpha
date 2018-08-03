import {cloneDeep} from "lodash";
import * as types from "../actionTypes";


const initialState = {};

const addVotesToSurvey = (action, state) => {
  var newState = cloneDeep(state);
  newState.survey.downvotesFrom = action.downvotesFrom;
  newState.survey.upvotesFrom = action.upvotesFrom;
  return newState
}

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_SURVEY_FETCH_SUCCESS:
      return {
        ...state,
        ...action.surveyMetadata
      };
    case types.SURVEY_VOTED:
      return addVotesToSurvey(action, state)
    default:
      return state;
  }
}

export function getSelectedSurvey(state) {
  return state.scenes.project.scenes.survey.data.metadata;
}
