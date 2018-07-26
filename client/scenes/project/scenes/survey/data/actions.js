import * as types from "./actionTypes";
import {
  getSurveyByProjectSurveyId,
  postUpvoteToProjectSurvey,
  postDownvoteToProjectSurvey,
  putOnboardStatus
} from "./service";
import { keyBy, omit, assignIn, pick, sortBy } from "lodash";
import { notify } from "reapop";

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
        projectSurvey.survey.survey_questions,
        ["order_in_survey"],
        ["asc"]
      );
      const surveyQnasById = keyBy(surveyQnas, "id");
      const surveyQnaIds = surveyQnas.map(qna => qna.id);
      const surveyVersions = projectSurvey.ancestors
        .concat([
          omit(projectSurvey, [
            "ancestors",
            "descendents",
            "survey.survey_questions"
          ])
        ])
        .concat(projectSurvey.descendents);
      projectSurvey.versions = surveyVersions;
      const surveyMetadata = assignIn(
        pick(projectSurvey, [
          "title",
          "description",
          "id",
          "creator",
          "collaborators",
          "versions",
          "hierarchyLevel",
          "resolvedIssues",
          "comment_until_unix",
          "createdAt",
          "upvotesFrom",
          "downvotesFrom",
          "scorecard"
        ]),
        omit(projectSurvey.survey, ["survey_questions", "id"])
      );
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

export function upvoteProjectSurvey({
  projectSurveyId,
  projectSymbol,
  hasUpvoted
}) {
  return async (dispatch, getState) => {
    try {
      const upvotesFrom = await postUpvoteToProjectSurvey({
        projectSurveyId,
        projectSymbol,
        hasUpvoted
      });
      dispatch({
        type: types.PROJECT_SURVEY_UPVOTED,
        upvotesFrom
      });
      if (!hasUpvoted)
        dispatch(
          notify({
            title: "Please leave a comment, and let me know what you think.",
            message: "",
            status: "info",
            dismissible: true,
            dismissAfter: 3000
          })
        );
    } catch (err) {
      console.log(err);
    }
  };
}

export function downvoteProjectSurvey({
  projectSurveyId,
  projectSymbol,
  hasDownvoted
}) {
  return async (dispatch, getState) => {
    try {
      const downvotesFrom = await postDownvoteToProjectSurvey({
        projectSurveyId,
        projectSymbol,
        hasDownvoted
      });
      dispatch({
        type: types.PROJECT_SURVEY_DOWNVOTED,
        downvotesFrom
      });
      if (!hasDownvoted)
        dispatch(
          notify({
            title: "Please leave a comment, and let me know what you think.",
            message: "",
            status: "info",
            dismissible: true,
            dismissAfter: 3000
          })
        );
    } catch (err) {
      console.log(err);
    }
  };
}
