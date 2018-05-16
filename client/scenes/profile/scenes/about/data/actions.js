import * as types from "./actionTypes";
import { getUserBasicInfo, postAccessStatus } from "./service";

export function fetchUserBasicInfo(userId) {
  return async (dispatch, getState) => {
    try {
      userId = userId === "profile" ? getState().data.user.id : userId;
      const profile = await getUserBasicInfo(userId);
      dispatch({
        type: types.BASIC_INFO_FETCH_SUCCESS,
        profile
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function changeAccessStatus({ userId, accessStatus }) {
  return async (dispatch, getState) => {
    try {
      await postAccessStatus({ userId, accessStatus });
      dispatch({
        type: types.ACCESS_STATUS_UPDATED,
        accessStatus
      });
    } catch (error) {
      console.error(error);
    }
  };
}
