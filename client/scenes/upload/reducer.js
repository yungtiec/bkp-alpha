import { omit } from "lodash";
import { reducer as dataReducer } from "./data/reducer";

const SIDEBAR_OPEN_TOGGLE = "upload.SIDEBAR_OPEN_TOGGLE";

export const toggleSidebar = () => ({
  type: SIDEBAR_OPEN_TOGGLE
});

const initialState = {
  sidebarOpen: true
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
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
