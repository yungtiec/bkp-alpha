import axios from "axios";

export function getUserNotifications(userId) {
  return axios.get(`/api/notifications`).then(res => res.data);
}

export function putNotificationStatus(notification, status) {
  return axios
    .put(`/api/notifications/${notification.id}`, { status })
    .then(res => res.data);
}

export function putAllNotificationStatus(notificationIds, status) {
  return axios
    .put(`/api/notifications`, { notificationIds, status })
    .then(res => res.data);
}
