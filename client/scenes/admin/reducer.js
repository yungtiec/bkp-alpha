import * as types from "./data/pendingAnnotations/actionTypes";
import { reducer as dataReducer } from "./data/reducer";
import { omit } from "lodash";

const initialState = { loading: false };

const loadingReducer = (state, action) => {
  switch (action.type) {
    case types.PENDING_ANNOTATIONS_FETCH_REQUEST:
      return true;
    case types.PENDING_ANNOTATIONS_FETCH_SUCCESS:
    case types.PENDING_ANNOTATIONS_FETCH_ERROR:
      return false;
    default:
      return state;
  }
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    default:
      const rest = _.omit(state, Object.keys(initialState));
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: dataReducer(rest.data, action)
      };
  }
};
