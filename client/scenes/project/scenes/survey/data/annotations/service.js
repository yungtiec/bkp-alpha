import axios from "axios";

export function getAnnotationsBySurvey(uri) {
  return axios
    .get("/api/annotation/survey", {
      params: {
        uri
      }
    })
    .then(res => res.data);
}
