import * as types from "./actionTypes";
import { values, orderBy, cloneDeep, keys } from "lodash";

const initialState = {
  usersById: {},
  userIds: [],
  fetchError: false
};

const storeUsers = (state, action) => {
  const sortedUsers = orderBy(
    values(action.usersById),
    ["num_upvotes", "email"],
    ["desc", "asc"]
  );
  const userIds = sortedUsers.map(s => s.id);
  return {
    ...state,
    usersById: action.usersById,
    userIds
  };
};


export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.LEADERBOARD_FETCH_SUCCESS:
      return storeUsers(cloneDeep(state), action);
    case types.LEADERBOARD_FETCH_ERROR:
      return {
        fetchError: true,
        ...state
      };
    default:
      return state;
  }
}

export const getUsers = state =>
  state.scenes.leaderboard.data;
