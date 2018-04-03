import axios from "axios";

export function getPendingAnnotations() {
  return axios.get("/api/annotation/pending").then(res => res.data);
}
