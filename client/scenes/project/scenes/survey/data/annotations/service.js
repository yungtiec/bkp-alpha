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

export function updateAnnotationComment({
  annotationId,
  comment,
  tags,
  issueOpen
}) {
  return axios
    .post("/api/annotation/edit", { annotationId, comment, tags, issueOpen })
    .then(res => res.data);
}

export function postPendingAnnotationStatus({ annotation, reviewed }) {
  return axios.post("/api/admin/engagement-item/verify", {
    engagementItem: annotation,
    reviewed
  });
}

export function updateAnnotationIssueStatus({ annotation, open }) {
  return axios.post("/api/admin/engagement-item/issue", {
    engagementItem: annotation,
    open
  });
}
