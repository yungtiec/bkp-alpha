import * as types from "./actionTypes";
import { keyBy } from "lodash";
import { getAllProjects } from './service'

export function fetchAllProjects() {
  return async dispatch => {
    try {
      const projects = await getAllProjects();
      const projectsBySymbol = keyBy(projects, "symbol");
      const projectSymbolArr = projects.map(project => project.symbol);
      dispatch({
        type: types.PROJECTS_FETCH_SUCCESS,
        projectSymbolArr,
        projectsBySymbol
      });
    } catch (error) {
      console.error(error);
    }
  };
}
