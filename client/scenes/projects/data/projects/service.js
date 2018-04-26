import axios from "axios";

export function getAllProjects() {
  return axios.get("/api/project").then(res => res.data);
}
