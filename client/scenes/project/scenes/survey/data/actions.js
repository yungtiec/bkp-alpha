import * as types from "./actionTypes";
import {
  getSurveyByProjectSurveyId,
  postUpvoteToSurvey
} from "./service";
import { keyBy, omit, assignIn, pick, sortBy } from "lodash";

export function fetchQuestionsByProjectSurveyId({
  projectSurveyId,
  projectSymbol
}) {
  return async (dispatch, getState) => {
    try {
      var projectSurvey = await getSurveyByProjectSurveyId(
        projectSymbol,
        projectSurveyId
      );
      const surveyQnas = sortBy(
        projectSurvey.survey_questions,
        ["order_in_survey"],
        ["asc"]
      );
      const surveyQnasById = keyBy(surveyQnas, "id");
      const surveyQnaIds = surveyQnas.map(qna => qna.id);
      const surveyVersions = projectSurvey.ancestors
        .concat([
          omit(projectSurvey, ["ancestors", "descendents", "survey_questions"])
        ])
        .concat(projectSurvey.descendents);
      projectSurvey.versions = surveyVersions;
      const surveyMetadata = omit(projectSurvey, ["survey_questions"]);
      dispatch({
        type: types.PROJECT_SURVEY_FETCH_SUCCESS,
        surveyQnasById,
        surveyQnaIds,
        surveyMetadata
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function upvoteSurvey({
  surveyId,
  projectSymbol,
  hasUpvoted
}) {
  return async (dispatch, getState) => {
    try {
      const upvotesFrom = await postUpvoteToSurvey({
        surveyId,
        projectSymbol,
        hasUpvoted
      });
      dispatch({
        type: types.PROJECT_SURVEY_UPVOTED,
        upvotesFrom
      });
    } catch (err) {
      console.log(err);
    }
  };
}
