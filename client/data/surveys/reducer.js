import * as types from "./actionTypes";
import { values, orderBy, cloneDeep, keys, assignIn } from "lodash";

const initialState = {
  surveysById: {},
  surveyIds: [],
  offset: 0,
  limit: 10,
  count: null,
  fetchError: false
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.SURVEY_LISTING_FETCH_SUCCESS:
      return {
        ...state,
        surveysById: assignIn(action.surveysById, state.surveysById),
        surveyIds: (state.surveyIds || []).concat(action.surveyIds),
        offset: action.offset,
        count: action.count
      };
    case types.SURVEY_LISTING_FETCH_ERROR:
      return {
        fetchError: true,
        ...state
      };
    default:
      return state;
  }
}

export const getSurveyListing = state => state.data.surveys;
