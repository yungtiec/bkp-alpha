import axios from "axios";

export function getComments(projectSurveyId) {
  return axios
    .get(`/admin/projects/-/surveys/${projectSurveyId}/comments`)
    .then(res => res.data);
}

export function postPendingCommentStatus(comment, reviewed) {
  return axios.post(`/api/projects/-/surveys/-/comments/${comment.id}/verify`, {
    reviewed
  });
}

export function updateCommentIssueStatus({ comment, open }) {
  return axios.post(`/api/projects/-/surveys/-/comments/${comment.id}/issue`, {
    open
  });
}
