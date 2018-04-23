import * as types from "./data/pendingAnnotations/actionTypes";
import { reducer as dataReducer } from "./data/reducer";
import { omit } from "lodash";

const initialState = {};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    default:
      const rest = _.omit(state, Object.keys(initialState));
      return {
        ...state,
        data: dataReducer(rest.data, action)
      };
  }
};
