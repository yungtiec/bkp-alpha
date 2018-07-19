import * as types from "./actionTypes.js";
import { getLastestSurveysWithStats } from "./service";
import { keyBy } from "lodash";

export function fetchLastestSurveysWithStats() {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const { offset, limit } = state.data.surveys;
      const { count, surveys } = await getLastestSurveysWithStats({
        offset,
        limit
      });
      const surveyIds = surveys.map(s => s.id);
      const surveysById = keyBy(surveys, "id");
      dispatch({
        type: types.SURVEY_LISTING_FETCH_SUCCESS,
        surveysById,
        surveyIds,
        count,
        offset: offset + limit
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: types.SURVEY_LISTING__FETCH_ERROR
      });
    }
  };
}
