import axios from "axios";

export function getCommentsBySurvey(projectSymbol, projectSurveyId) {
  return axios
    .get(`/api/projects/${projectSymbol}/surveys/${projectSurveyId}/comments`)
    .then(res => res.data);
}

export function postComment({
  projectSymbol,
  projectSurveyId,
  newComment,
  tags,
  issueOpen
}) {
  return axios
    .post(
      `/api/projects/${projectSymbol}/surveys/${projectSurveyId}/comments`,
      {
        newComment,
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
  newComment
}) {
  return axios
    .post(
      `/api/projects/${projectSymbol}/surveys/${projectSurveyId}/comments/${parentId}/reply`,
      {
        rootId,
        newComment
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
  newComment,
  tags,
  issueOpen
}) {
  return axios
    .post(
      `/api/projects/${projectSymbol}/surveys/${projectSurveyId}/comments/${commentId}/edit`,
      { newComment, tags, issueOpen }
    )
    .then(res => res.data);
}

export function postPendingCommentStatus({ comment, reviewed }) {
  return axios.post(`/api/projects/-/surveys/-/comments/${comment.id}/verify`, {
    reviewed
  });
}

export function updateCommentIssueStatus({ comment, open }) {
  return axios.post(`/api/projects/-/surveys/-/comments/${comment.id}/issue`, {
    open
  });
}
