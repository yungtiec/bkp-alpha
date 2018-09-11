import { maxBy } from "lodash";
import * as types from "./actionTypes";
import {
  getMetadataByDocumentId,
  postUpvoteToDocument,
  postDownvoteToDocument
} from "./service";

export function fetchMetadataByDocumentId(documentId, versionId) {
  return async (dispatch, getState) => {
    try {
      var documentMetadata = await getMetadataByDocumentId(documentId);
      dispatch({
        type: types.DOCUMENT_METADATA_FETCH_SUCCESS,
        documentMetadata
      });
    } catch (error) {
      console.error(error);
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
