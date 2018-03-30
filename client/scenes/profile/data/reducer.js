import { combineReducers } from "redux";

import { default as aboutReducer } from "./about/reducer";
import { default as pastActionsReducer } from "./pastActions/reducer";

export const reducer = combineReducers({
  about: aboutReducer,
  pastActions: pastActionsReducer
});

export const getProfile = state => state.scenes.profile.data;
