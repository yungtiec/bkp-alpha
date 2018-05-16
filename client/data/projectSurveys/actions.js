import * as types from "./actionTypes.js";
import { getPublishedProjectSurveyStats } from "./service";
import { keyBy } from "lodash";

export function fetchPublishedProjectSurveyStats() {
  return async (dispatch, getState) => {
    try {
      if (getState().data.projectSurveys.latestProjectSurveyIds) return;
      const projectSurveys = await getPublishedProjectSurveyStats();
      const latestProjectSurveyIds = projectSurveys
        .slice(0, 5)
        .map(ps => ps.id);
      const projectSurveysById = keyBy(projectSurveys, "id");
      dispatch({
        type: types.PROJECT_SURVEY_STATS_FETCH_SUCCESS,
        projectSurveysById,
        latestProjectSurveyIds
      });
    } catch (error) {
      dispatch({
        type: types.PROJECT_SURVEY_STATS_FETCH_ERROR
      });
    }
  };
}
