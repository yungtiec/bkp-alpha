import axios from "axios";

export function getUserBasicInfo(userId) {
  return axios.get(`/api/users/${userId}`).then(res => res.data);
}

export function postAccessStatus({ userId, accessStatus }) {
  return axios
    .post(`/api/admin/user/access`, {
      userId,
      accessStatus
    })
    .then(res => res.data);
}
