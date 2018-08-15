import * as types from "./actionTypes.js";
import { getUsers, postAccessStatus } from "./service";
import { keyBy } from "lodash";

export function fetchUsers() {
  return async dispatch => {
    try {
      const users = await getUsers();
      const usersById = keyBy(users, "id");
      dispatch({
        type: types.USER_LIST_FETCH_SUCCESS,
        usersById
      });
    } catch (error) {
      dispatch({
        type: types.USER_LIST_FETCH_ERROR
      });
    }
  };
}

export function changeAccessStatus({ userId, accessStatus }) {
  return async (dispatch, getState) => {
    try {
      await postAccessStatus({ userId, accessStatus });
      dispatch({
        type: types.USER_ACCESS_STATUS_UPDATED,
        userId,
        accessStatus
      });
    } catch (error) {
      console.error(error);
    }
  };
}
