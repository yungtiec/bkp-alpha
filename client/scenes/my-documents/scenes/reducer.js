import { combineReducers } from "redux";

import { default as draftsReducer } from "./drafts/reducer";

export const reducer = combineReducers({
  drafts: draftsReducer
});
