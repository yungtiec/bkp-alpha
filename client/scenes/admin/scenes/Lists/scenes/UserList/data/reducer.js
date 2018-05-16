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
    ["num_spam", "email"],
    ["desc", "asc"]
  );
  const userIds = sortedUsers.map(s => s.id);
  return {
    usersById: action.usersById,
    userIds
  };
};

const updateUserAccessStatus = (state, action) => {
  state.usersById[Number(action.userId)].restricted_access =
    action.accessStatus === "restricted";
  return {
    ...state
  };
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.USER_LIST_FETCH_SUCCESS:
      return storeUsers(cloneDeep(state), action);
    case types.USER_LIST_FETCH_ERROR:
      return {
        fetchError: true,
        ...state
      };
    case types.USER_ACCESS_STATUS_UPDATED:
      return updateUserAccessStatus(cloneDeep(state), action);
    default:
      return state;
  }
}

export const getUsers = state =>
  state.scenes.admin.scenes.lists.scenes.userList.data;
