import { combineReducers } from "redux";

import { default as projectSurveyReducer } from "./projectSurvey/reducer";
import { default as projectSurveyListReducer } from "./projectSurveyList/reducer";


export const reducer = combineReducers({
  projectSurvey: projectSurveyReducer,
  projectSurveyList: projectSurveyListReducer
});
