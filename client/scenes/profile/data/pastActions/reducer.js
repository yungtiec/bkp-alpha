import _ from "lodash";
import * as types from "../actionTypes";

const initialState = {};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROFILE_FETCH_SUCCESS:
      return {
        ...state,
        ...action.pastActions
      }
    default:
      return state;
  }
}
