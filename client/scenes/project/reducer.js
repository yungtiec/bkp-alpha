import { omit } from "lodash";
import * as projectTypes from "./data/actionTypes";
import * as surveyTypes from "./scenes/survey/data/actionTypes";
import { reducer as dataReducer } from "./data/reducer";
import { reducer as sceneReducer } from "./scenes/reducer";

const DRAWER_TOGGLE = "project.DRAWER_TOGGLE";

const initialState = {
  projectLoading: false,
  surveyLoading: false,
  drawerVisible: false
};

const projectLoadingReducer = (state, action) => {
  switch (action.type) {
    case projectTypes.PROJECT_FETCH_REQUEST:
      return true;
    case projectTypes.PROJECT_FETCH_SUCCESS:
    case projectTypes.PROJECT_FETCH_ERROR:
      return false;
    default:
      return state;
  }
};

const surveyLoadingReducer = (state, action) => {
  switch (action.type) {
    case surveyTypes.SURVEY_FETCH_REQUEST:
      return true;
    case surveyTypes.SURVEY_FETCH_SUCCESS:
    case surveyTypes.SURVEY_FETCH_ERROR:
      return false;
    default:
      return state;
  }
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case DRAWER_TOGGLE:
      return { ...state, drawerVisible: !state.drawerVisible };
    default:
      const rest = _.omit(state, Object.keys(initialState));
      return {
        ...state,
        projectLoading: projectLoadingReducer(state.projectLoading, action),
        surveyLoading: surveyLoadingReducer(state.surveyLoading, action),
        data: dataReducer(rest.data, action),
        scenes: sceneReducer(rest.scenes, action)
      };
  }
}
