import { combineReducers } from "redux";

import { default as aboutReducer } from "./about/reducer";
import { default as annotationsReducer } from "./annotations/reducer";

export const reducer = combineReducers({
  about: aboutReducer,
  annotations: annotationsReducer
});
