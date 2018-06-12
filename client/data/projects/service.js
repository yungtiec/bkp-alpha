import axios from "axios";

export function getAllProjects() {
  return axios.get("/api/projects").then(res => res.data);
}
