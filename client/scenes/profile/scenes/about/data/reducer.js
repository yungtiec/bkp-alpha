import * as types from "./actionTypes";
import { cloneDeep } from "lodash";

const initialState = {};

export default function reduce(state = initialState, action = {}) {
  var newState;
  switch (action.type) {
    case types.BASIC_INFO_FETCH_SUCCESS:
      return {
        ...state,
        ...action.profile
      };
    case types.ACCESS_STATUS_UPDATED:
      newState = cloneDeep(state);
      newState.restricted_access = action.accessStatus === "restricted";
      return newState;
    default:
      return state;
  }
}

export const getUserBasicInfo = state => state.scenes.profile.scenes.about.data;
