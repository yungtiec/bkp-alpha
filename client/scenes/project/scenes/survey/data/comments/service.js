import axios from "axios";

export function getCommentsBySurvey(projectSymbol, projectSurveyId) {
  return axios
    .get(`/api/projects/${projectSymbol}/surveys/${projectSurveyId}/comments`)
    .then(res => res.data);
}

export function postComment({
  projectSymbol,
  projectSurveyId,
  comment,
  tags,
  issueOpen
}) {
  return axios
    .post(
      `/api/projects/${projectSymbol}/surveys/${projectSurveyId}/comments`,
      {
        comment,
        tags,
        issueOpen
      }
    )
    .then(res => res.data);
}

export function postReplyToComment({
  projectSymbol,
  projectSurveyId,
  rootId,
  parentId,
  comment
}) {
  return axios
    .post(
      `/api/projects/${projectSymbol}/surveys/${projectSurveyId}/comments/${parentId}/reply`,
      {
        rootId,
        comment
      }
    )
    .then(res => res.data);
}

export function postUpvoteToComment({
  projectSymbol,
  projectSurveyId,
  commentId,
  hasUpvoted
}) {
  return axios
    .post(
      `/api/projects/${projectSymbol}/surveys/${projectSurveyId}/comments/${commentId}/upvote`,
      { commentId, hasUpvoted }
    )
    .then(res => res.data);
}

export function updateComment({
  projectSymbol,
  projectSurveyId,
  commentId,
  updatedComment,
  tags,
  issueOpen
}) {
  return axios
    .post(
      `/api/projects/${projectSymbol}/surveys/${projectSurveyId}/comments/${commentId}/edit`,
      { updatedComment, tags, issueOpen }
    )
    .then(res => res.data);
}

export function postPendingCommentStatus({ comment, reviewed }) {
  return axios.post("/api/admin/comment/verify", {
    comment,
    reviewed
  });
}

export function updateCommentIssueStatus({ comment, open }) {
  return axios.post("/api/admin/comment/issue", {
    comment,
    open
  });
}
