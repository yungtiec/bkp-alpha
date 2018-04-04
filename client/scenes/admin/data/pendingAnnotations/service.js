import axios from "axios";

export function getPendingAnnotations() {
  return axios.get("/api/annotation/pending").then(res => res.data);
}

export function postPendingAnnotationStatus(annotationId, reviewed) {
  return axios.post("/api/annotation/verify", {annotationId, reviewed})
}

