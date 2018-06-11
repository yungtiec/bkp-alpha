import { combineReducers } from "redux";

import { default as uploadReducer } from "./upload/reducer";

export const reducer = combineReducers({
  upload: uploadReducer
});
