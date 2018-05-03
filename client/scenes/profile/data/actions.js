import * as types from "./actionTypes";
import { keyBy, assignIn, omit, pick } from "lodash";
import { getUserProfile } from "./service";

export function fetchUserProfile() {
  return async (dispatch, getState) => {
    try {
      const userId = getState().data.user.id;
      const profile = await getUserProfile(userId);
      const about = omit(profile, ["project_survey_comments", "annotations"]);
      const pastActions = pick(profile, [
        "project_survey_comments",
        "annotations"
      ]);
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
