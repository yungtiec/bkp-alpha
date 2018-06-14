import * as types from "./actionTypes";
import { keyBy, assignIn, omit, pick } from "lodash";
import { getProjectBySymbol } from "./service";

export function fetchProjectBySymbol(symbol) {
  return async (dispatch, getState) => {
    try {
      const currentProject = getState().scenes.project.data.metadata;
      if (currentProject.symbol === symbol) return;
      const project = await getProjectBySymbol(symbol);
      const projectSurveys =
        project.project_surveys && project.project_surveys.length
          ? project.project_surveys.map(s =>
              assignIn(
                pick(s.survey, ["creator", "title", "description"]),
                omit(s, ["survey"])
              )
            )
          : [];
      const projectMetadata = omit(project, ["project_surveys"]);
      const projectSurveysById = keyBy(projectSurveys, "id");
      const projectSurveyIds = projectSurveys.map(ps => ps.id);
      dispatch({
        type: types.PROJECT_FETCH_SUCCESS,
        projectMetadata,
        projectSurveysById,
        projectSurveyIds
      });
    } catch (error) {
      console.error(error);
    }
  };
}
