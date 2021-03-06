import * as types from "./actionTypes";
import { values, orderBy, cloneDeep, keys, assignIn, uniq } from "lodash";

const initialState = {
  documentsById: null,
  documentIds: null,
  offset: 0,
  limit: 10,
  count: null,
  fetchError: false
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.DOCUMENT_LISTING_FETCH_SUCCESS:
      return {
        ...state,
        documentsById: assignIn(action.documentsById, state.documentsById || {}),
        documentIds: uniq((state.documentIds || []).concat(action.documentIds)),
        offset: action.offset,
        count: action.count
      };
    case types.DOCUMENT_LISTING_FETCH_ERROR:
      return {
        fetchError: true,
        ...state
      };
    default:
      return state;
  }
}

export const getDocumentListing = state => state.data.documents;
