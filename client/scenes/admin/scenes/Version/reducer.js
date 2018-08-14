import { omit } from "lodash";
import { reducer as dataReducer } from "./data/reducer";

const initialState = {
  checked: []
};

const SIDEBAR_FILTER_CHECKED = "admin.version.SIDEBAR_FILTER_CHECKED";

export const checkSidebarFilter = checked => ({
  type: SIDEBAR_FILTER_CHECKED,
  checked
});

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case SIDEBAR_FILTER_CHECKED:
      return { ...state, checked: action.checked };
    default:
      const rest = _.omit(state, Object.keys(initialState));
      return {
        ...state,
        data: dataReducer(rest.data, action)
      };
  }
}
