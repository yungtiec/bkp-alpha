import * as types from "./actionTypes";
import { keyBy, assignIn } from "lodash";
import {
  getEngagementItems,
  postPendingEngagementItemStatus,
  updateEngagementItemIssueStatus
} from "./service";
import { notify } from "reapop";

export function fetchEngagementItems(projectSurveyId) {
  return async dispatch => {
    try {
      var engagementItems = await getEngagementItems(projectSurveyId);
      const engagementItemsById = keyBy(engagementItems, "engagementItemId");
      dispatch({
        type: types.ENGAGEMENT_ITEMS_FETCH_SUCCESS,
        engagementItemsById
      });
    } catch (error) {
      dispatch(
        notify({
          title: "Unauthorized requests",
          message: "",
          status: "error",
          dismissible: true,
          dismissAfter: 3000
        })
      );
    }
  };
}

export function verifyPendingEngagementItem(engagementItem, status) {
  return async dispatch => {
    try {
      await postPendingEngagementItemStatus(engagementItem, status);
      dispatch({
        type: types.ENGAGEMENT_ITEM_VERIFIED_SUCCESS,
        engagementItem: engagementItem,
        status
      });
    } catch (error) {
      dispatch(
        notify({
          title: "Something went wrong",
          message: "Please try again later",
          status: "error",
          dismissible: true,
          dismissAfter: 3000
        })
      );
    }
  };
}

export const changeEngagementItemIssueStatus = engagementItem => {
  return async (dispatch, getState) => {
    try {
      const user = getState().data.user;
      if (!user.roles.filter(r => r.name === "admin").length) return;
      const open = engagementItem.issue ? !engagementItem.issue.open : true;

      await updateEngagementItemIssueStatus({
        engagementItem,
        open
      });
      dispatch({
        type: types.ENGAGEMENT_ITEM_ISSUE_UPDATED,
        engagementItem,
        open
      });
    } catch (err) {
      dispatch(
        notify({
          title: "Something went wrong",
          message: "Please try again later",
          status: "error",
          dismissible: true,
          dismissAfter: 3000
        })
      );
    }
  };
};
