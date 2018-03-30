import { omit } from "lodash";
import * as types from "./data/actionTypes";
import { reducer as dataReducer } from "./data/reducer";

const DRAWER_TOGGLE = "profile.DRAWER_TOGGLE";

const initialState = { loading: false, drawerVisible: false };

const loadingReducer = (state, action) => {
  switch (action.type) {
    case types.PROFILE_FETCH_REQUEST:
      return true;
    case types.PROFILE_FETCH_SUCCESS:
    case types.PROFILE_FETCH_ERROR:
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
        loading: loadingReducer(state.loading, action),
        data: dataReducer(rest.data, action)
      };
  }
}
