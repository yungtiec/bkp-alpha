import axios from "axios";

export const getUsers = () =>
  axios.get("/api/admin/users").then(res => res.data);

export function postAccessStatus({ userId, accessStatus }) {
  return axios
    .post(`/api/admin/user/access`, {
      userId,
      accessStatus
    })
    .then(res => res.data);
}
