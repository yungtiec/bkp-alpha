import { omit } from "lodash";
import * as types from "./data/actionTypes";
import { reducer as dataReducer } from "./data/reducer";

const SIDEBAR_OPEN_TOGGLE = "survey.SIDEBAR_OPEN_TOGGLE";
const SHOW_HIGHLIGHT_TOGGLE = "survey.SHOW_HIGHLIGHT_TOGGLE";

export const toggleSidebar = () => ({
  type: "survey.SIDEBAR_OPEN_TOGGLE"
});

export const toggleHighlights = () => ({
  type: "survey.SHOW_HIGHLIGHT_TOGGLE"
});

const initialState = {
  sidebarOpen: true,
  showHighlights: true
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case SHOW_HIGHLIGHT_TOGGLE:
      return { ...state, showHighlights: !state.showHighlights };
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
