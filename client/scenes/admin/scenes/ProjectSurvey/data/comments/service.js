import axios from "axios";

export function getComments(projectSurveyId) {
  return axios
    .get(`/api/admin/project-survey/${projectSurveyId}`)
    .then(res => res.data);
}

export function postPendingCommentStatus(comment, reviewed) {
  return axios.post("/api/admin/comment/verify", { comment, reviewed });
}

export function updateCommentIssueStatus({ comment, open }) {
  return axios.post("/api/admin/comment/issue", {
    comment,
    open
  });
}
