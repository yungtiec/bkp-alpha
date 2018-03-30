import * as types from "./actionTypes";
import { keyBy, assignIn, omit, pick } from "lodash";
import { getUserProfile } from "./service";

export function fetchUserProfile() {
  return async dispatch => {
    try {
      const profile = await getUserProfile();
      const about = omit(profile, ["replies", "annotations"]);
      const pastActions = pick(profile, ["replies", "annotations"]);
      dispatch({
        type: types.PROFILE_FETCH_SUCCESS,
        about,
        pastActions
      });
    } catch (error) {
      console.error(error);
    }
  };
}
