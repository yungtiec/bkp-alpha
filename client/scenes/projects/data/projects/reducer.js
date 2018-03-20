import { pick } from "lodash";
import * as types from "./actionTypes";
import { combineReducers } from "redux";

const initialState = {
  projectsBySymbol: {},
  projectSymbolArr: [],
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECTS_FETCH_SUCCESS:
      return {
        ...state,
        projectSymbolArr: action.projectSymbolArr,
        projectsBySymbol: action.projectsBySymbol
      };
    default:
      return state;
  }
}

export function getAllProjects(state) {
  return pick(state.scenes.projects.data.projects, ["projectsBySymbol", "projectSymbolArr"]);
}
