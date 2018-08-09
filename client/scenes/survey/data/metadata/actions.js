import * as types from "./actionTypes";
import {
  postUpvoteToSurvey,
  postDownvoteToSurvey,
  getMetadataByProjectSurveyId
} from "./service";
import { notify } from "reapop";
import { loadModal } from "../../../../data/reducer";

export function fetchMetadataByProjectSurveyId(projectSurveyId) {
  return async (dispatch, getState) => {
    try {
      var surveyMetadata = await getMetadataByProjectSurveyId(projectSurveyId);
      dispatch({
        type: types.PROJECT_SURVEY_METADATA_FETCH_SUCCESS,
        surveyMetadata
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function upvoteSurvey({
  surveyId,
  projectSurveyId,
  projectSymbol,
  hasUpvoted,
  hasDownvoted
}) {
  return async (dispatch, getState) => {
    try {
      const [upvotesFrom, downvotesFrom] = await postUpvoteToSurvey({
        surveyId,
        projectSymbol,
        hasUpvoted,
        hasDownvoted
      });
      dispatch({
        type: types.SURVEY_VOTED,
        upvotesFrom,
        downvotesFrom
      });
      dispatch(
        loadModal("COMMENT_MODAL", {
          projectSurveyId
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
}

export function downvoteSurvey({
  surveyId,
  projectSurveyId,
  projectSymbol,
  hasUpvoted,
  hasDownvoted
}) {
  return async (dispatch, getState) => {
    try {
      const [upvotesFrom, downvotesFrom] = await postDownvoteToSurvey({
        surveyId,
        projectSymbol,
        hasUpvoted,
        hasDownvoted
      });
      dispatch({
        type: types.SURVEY_VOTED,
        upvotesFrom,
        downvotesFrom
      });
      dispatch(
        loadModal("COMMENT_MODAL", {
          projectSurveyId
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
}
