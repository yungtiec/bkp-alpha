import axios from "axios";

export const getUsers = () => axios.get("/admin/users").then(res => res.data);

export function postAccessStatus({ userId, accessStatus }) {
  return axios
    .put(`/admin/users/${userId}/access`, {
      accessStatus
    })
    .then(res => res.data);
}
