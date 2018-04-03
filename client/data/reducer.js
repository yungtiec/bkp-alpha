import { combineReducers } from "redux";

import { default as userReducer } from "./user/reducer";
import { default as modalReducer } from "./modal/reducer";
import { default as searchReducer } from "./search/reducer";
import { default as environmentReducer } from "./environment/reducer";

export default combineReducers({
  user: userReducer,
  modal: modalReducer,
  search: searchReducer,
  environment: environmentReducer
});

export * from "./user/reducer";
export * from "./user/actions";
export * from "./modal/reducer";
export * from "./modal/actions";
export * from "./search/reducer";
export * from "./search/actions";
export * from "./environment/reducer";
export * from "./environment/actions";
