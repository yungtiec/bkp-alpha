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

export function postUpvoteToAnnotation({ annotationId, hasUpvoted }) {
  return axios
    .post("/api/annotation/upvote", { annotationId, hasUpvoted })
    .then(res => res.data);
}

export function postUpdatedCommentToAnnotation({ annotationId, comment }) {
  return axios
    .post("/api/annotation/edit", { annotationId, comment })
    .then(res => res.data);
}

export function postPendingAnnotationStatus({ annotationId, reviewed }) {
  return axios.post("/api/annotation/verify", {
    annotationId,
    reviewed
  });
}

export function getAllTags() {
  return axios.get("/api/tag").then(res => res.data);
}

export function deleteTag({ annotationId, tagId }) {
  return axios.put("/api/annotation/tag/remove", { annotationId, tagId });
}

export function putTag({ annotationId, tagName }) {
  console.log(tagName)
  return axios
    .put("/api/annotation/tag/add", { annotationId, tagName })
    .then(res => res.data);
}
