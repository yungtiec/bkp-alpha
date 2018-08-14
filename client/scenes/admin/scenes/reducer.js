import { combineReducers } from "redux";

import { default as versionReducer } from "./version/reducer";
import { default as listsReducer } from "./Lists/reducer";


export const reducer = combineReducers({
  version: versionReducer,
  lists: listsReducer
});
