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

export function postReplyToAnnotation({ parentId, comment }) {
  return axios
    .post("/api/annotation/reply", { parentId, comment })
    .then(res => res.data);
}


export function postUpvoteToAnnotation(annotationId) {
  return axios
    .post("/api/annotation/upvote", { annotationId })
    .then(res => res.data)
}
