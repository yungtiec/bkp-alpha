import { pick } from "lodash";
import * as types from "./actionTypes";
import survey from './survey/reducer'
import question from './question/reducer'
import { combineReducers } from "redux";

const initialState = {
  projectsBySymbol: {},
  projectSymbolArr: [],
  selectedSymbol: ""
};

function metadata(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECTS_FETCHED:
      return {
        ...state,
        projectSymbolArr: action.projectSymbolArr,
        projectsBySymbol: action.projectsBySymbol
      };
    case types.PROJECT_FETCHED:
      return {
        ...state,
        selectedSymbol: action.selectedProjectSymbol
      };
    default:
      return state;
  }
}

export function getSelectedProject(state) {
  if (state.project.selectedSymbol.length)
    return state.project.projectsBySymbol[state.project.selectedSymbol];
}

export function getAllProjects(state) {
  return pick(state.project, ["projectsBySymbol", "projectSymbolArr"]);
}

export default combineReducers({
  metadata,
  survey,
  question
});
