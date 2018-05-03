import { combineReducers } from "redux";

import { default as projectSurveyReducer } from "./projectSurvey/reducer";
import { default as listsReducer } from "./Lists/reducer";


export const reducer = combineReducers({
  projectSurvey: projectSurveyReducer,
  lists: listsReducer
});
