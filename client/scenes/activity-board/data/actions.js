import * as types from "./actionTypes.js";
import { getUsers, postAccessStatus } from "./service";
import { keyBy } from "lodash";

export function fetchUsers() {
  return async dispatch => {
    try {
      const users = await getUsers();
      const usersById = keyBy(users, "id");
      dispatch({
        type: types.LEADERBOARD_FETCH_SUCCESS,
        usersById
      });
    } catch (error) {
      dispatch({
        type: types.LEADERBOARD_FETCH_ERROR
      });
    }
  };
}
