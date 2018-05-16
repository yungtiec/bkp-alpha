import * as types from "./actionTypes";
import { values, orderBy, cloneDeep, keys } from "lodash";

const initialState = {
  projectSurveysById: {},
  projectSurveyIds: [],
  latestProjectSurveyIds: null,
  fetchError: false
};

const storeProjectSurveyStats = (state, action) => {
  const sortedProjectSurveys = orderBy(
    values(action.projectSurveysById),
    ["project.name", "id"],
    ["asc", "asc"]
  );
  const projectSurveyIds = sortedProjectSurveys.map(s => s.id);
  return {
    projectSurveysById: action.projectSurveysById,
    projectSurveyIds,
    latestProjectSurveyIds: action.latestProjectSurveyIds
  };
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_SURVEY_STATS_FETCH_SUCCESS:
      return storeProjectSurveyStats(cloneDeep(state), action);
    case types.PROJECT_SURVEY_STATS_FETCH_ERROR:
      return {
        fetchError: true,
        ...state
      };
    default:
      return state;
  }
}

export const getProjectSurveys = state => state.data.projectSurveys;
