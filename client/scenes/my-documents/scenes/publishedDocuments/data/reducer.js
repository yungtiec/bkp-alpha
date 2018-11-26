import * as types from "./actionTypes";
import { assignIn } from "lodash";

const initialState = {
  publishedDocumentsById: null,
  publishedDocumentIds: null,
  publishedDocumentOffset: 0,
  publishedDocumentLimit: 10,
  publishedDocumentCount: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.PUBLISHED_DOCUMENTS_FETCHED_SUCESSS:
      return {
        ...state,
        publishedDocumentsById: assignIn(
          action.publishedDocumentsById,
          state.publishedDocumentsById
        ),
        publishedDocumentIds: (state.publishedDocumentIds || []).concat(
          action.publishedDocumentIds
        ),
        publishedDocumentOffset: action.publishedDocumentOffset,
        publishedDocumentCount: action.count
      };
    default:
      return state;
  }
}

export function getOwnPublishedDocuments(state) {
  return {
    publishedDocumentsById:
      state.scenes.myDocuments.scenes.publishedDocuments.data
        .publishedDocumentsById,
    publishedDocumentIds:
      state.scenes.myDocuments.scenes.publishedDocuments.data
        .publishedDocumentIds
  };
}

export function canLoadMore(state) {
  return (
    state.scenes.myDocuments.scenes.publishedDocuments.data
      .publishedDocumentOffset <
    state.scenes.myDocuments.scenes.publishedDocuments.data
      .publishedDocumentCount
  );
}
