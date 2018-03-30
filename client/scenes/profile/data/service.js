import axios from "axios";

export function getUserProfile() {
  return axios.get("/api/users/profile").then(res => res.data);
}
