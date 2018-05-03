import axios from "axios";

export function getUserProfile(userId) {
  return axios.get(`/api/users/${userId}`).then(res => res.data);
}
