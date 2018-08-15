import axios from "axios";

export function getComments(versionId) {
  return axios
    .get(`/admin/projects/-/documents/${versionId}/comments`)
    .then(res => res.data);
}

export function postPendingCommentStatus(comment, reviewed) {
  return axios.post(`/api/projects/-/documents/-/comments/${comment.id}/verify`, {
    reviewed
  });
}

export function updateCommentIssueStatus({ comment, open }) {
  return axios.post(`/api/projects/-/documents/-/comments/${comment.id}/issue`, {
    open
  });
}
