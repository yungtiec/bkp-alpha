import * as types from "./actionTypes";
import { orderBy, keys, cloneDeep, assignIn } from "lodash";
import moment from "moment";

const initialState = {
  notificationsById: {},
  notificationIds: null
};

function addNotifications(state, action) {
  const sortedNotifications = orderBy(
    keys(action.notificationsById).map(nid => ({
      id: nid,
      unix: parseInt(
        moment(action.notificationsById[nid].createdAt).format("X")
      )
    })),
    ["unix"],
    ["desc"]
  );
  const notificationIds = sortedNotifications.map(a => a.id);
  return {
    notificationsById: action.notificationsById,
    notificationIds
  };
}

function updateNotificationStatus(state, action) {
  state.notificationsById[action.notificationId].status = action.status;
  return {
    ...state,
    notificationIds: state.notificationIds.filter(
      nid => state.notificationsById[nid].status !== "read"
    )
  };
}

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.NOTIFICATIONS_FETCH_SUCCESS:
      return addNotifications(cloneDeep(state), action);
    case types.NOTIFICATION_UPDATED:
      return updateNotificationStatus(cloneDeep(state), action);
    case types.ALL_NOTIFICATIONS_READ:
      return {
        notificationsById: {},
        notificationIds: []
      }
    default:
      return state;
  }
}

export const getUserNotifications = state => state.data.notifications;

export const getUserNotificationCount = state => {
  const user = state.data.user;
  if (
    user &&
    user.num_notifications &&
    state.data.notifications.notificationIds &&
    user.num_notifications !== state.data.notifications.notificationIds.length
  )
    return state.data.notifications.notificationIds.length;
  return user.num_notifications;
};
