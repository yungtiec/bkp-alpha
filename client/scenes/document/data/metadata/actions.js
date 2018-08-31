import * as types from "./actionTypes";
import {
  postUpvoteToDocument,
  postDownvoteToDocument,
  getMetadataByVersionId,
  putScorecard
} from "./service";
import { notify } from "reapop";
import { loadModal } from "../../../../data/reducer";

export function fetchMetadataByVersionId(versionId) {
  return async (dispatch, getState) => {
    try {
      var versionMetadata = await getMetadataByVersionId(versionId);
      dispatch({
        type: types.PROJECT_SURVEY_METADATA_FETCH_SUCCESS,
        versionMetadata
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function upvoteDocument({
  documentId,
  versionId,
  projectSymbol,
  hasUpvoted,
  hasDownvoted
}) {
  return async (dispatch, getState) => {
    try {
      const [upvotesFrom, downvotesFrom] = await postUpvoteToDocument({
        documentId,
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
          versionId
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
}

export function downvoteDocument({
  documentId,
  versionId,
  projectSymbol,
  hasUpvoted,
  hasDownvoted
}) {
  return async (dispatch, getState) => {
    try {
      const [upvotesFrom, downvotesFrom] = await postDownvoteToDocument({
        documentId,
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
          versionId
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
}

export function editScorecard({ versionId, scorecard }) {
  return async (dispatch, getState) => {
    try {
      const updatedScorecard = await putScorecard({
        versionId,
        scorecard
      });
      dispatch({
        type: types.VERSION_SCORECARD_UPDATED,
        scorecard: updatedScorecard
      });
    } catch (err) {
      console.log(err);
    }
  };
}
