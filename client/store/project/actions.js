import * as types from "./actionTypes";
import { keyBy, assignIn, omit, pick } from "lodash";

export function fetchAllProjecs() {
  return async dispatch => {
    try {
      const projects = await getAllProjects(symbol);
      const projectsBySymbol = keyBy(projects, "symbol");
      const projectSymbolArr = projects.map(project => project.symbol);
      dispatch({
        type: types.PROJECTS_FETCHED,
        projectSymbolArr,
        projectsBySymbol
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function fetchProjectBySymbol(symbol) {
  return async dispatch => {
    try {
      const project = await getProjectBySymbol(symbol);
      const projectSurveys = project.project_surveys.map(s =>
        assignIn(
          pick(s.survey, ["creator", "description"]),
          omit(s, ["survey"])
        )
      );
      const projectSurveysById = keyBy(projectSurveys, "id");
      const projectSurveyIds = projectSurveys.map(ps => ps.id);
      dispatch({
        type: types.PROJECT_SURVEYS_FETCHED,
        selectedProjectSymbol: project.id,
        projectSurveysById,
        projectSurveyIds
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function fetchQuestionsBySurveyId(surveyId) {
  return async (dispatch, getState) => {
    try {
      const projectSymbol = getState().project.selectedSymbol;
      const project = await getProjectBySymbol(symbol);
      const surveyQnas = keyBy(project.project_surveys, "id")[surveyId]
        .survey_questions;
      const surveyQnasById = keyBy(surveyQnas, "id");
      const surveyQnaIds = surveyQnas.map(qna => qna.id);
      dispatch({
        type: types.SURVEY_QUESTIONS_FETCHED,
        selectedSurveyId: surveyId,
        surveyQnasById,
        surveyQnaIds
      });
    } catch (error) {
      console.error(error);
    }
  };
}
