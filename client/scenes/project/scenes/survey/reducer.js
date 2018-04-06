import { omit } from "lodash";
import * as types from "./data/actionTypes";
import { reducer as dataReducer } from "./data/reducer";

const SIDEBAR_OPEN_TOGGLE = "survey.SIDEBAR_OPEN_TOGGLE";
const ANNOTATION_TYPE_IN_VIEW = "survey.ANNOTATION_TYPE_IN_VIEW";

export const toggleSidebar = () => ({
  type: "survey.SIDEBAR_OPEN_TOGGLE"
});

export const updateAnnotationTypeInView = annotationType => ({
  type: "survey.ANNOTATION_TYPE_IN_VIEW",
  annotationType
});

const initialState = {
  sidebarOpen: true,
  annotationType: "all"
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case ANNOTATION_TYPE_IN_VIEW:
      return { ...state, annotationType: action.annotationType };
    case SIDEBAR_OPEN_TOGGLE:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    default:
      const rest = _.omit(state, Object.keys(initialState));
      return {
        ...state,
        data: dataReducer(rest.data, action)
      };
  }
}
