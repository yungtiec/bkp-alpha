import axios from "axios";

export function getAnnotationsBySurvey(uri) {
  return axios
    .get("/api/annotation", {
      params: {
        uri
      }
    })
    .then(res => res.data);
}
