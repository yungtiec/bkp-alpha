import { combineReducers } from "redux";

import { default as draftsReducer } from "./drafts/reducer";
import { default as publishedDocumentsReducer } from "./publishedDocuments/reducer";

export const reducer = combineReducers({
  drafts: draftsReducer,
  publishedDocuments: publishedDocumentsReducer
});
