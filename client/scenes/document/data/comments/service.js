import axios from "axios";

export function getCommentsByDocument(versionId) {
  return axios
    .get(`/api/projects/-/documents/${versionId}/comments`)
    .then(res => res.data);
}

export function postComment({
  projectSymbol,
  versionId,
  newComment,
  tags,
  issueOpen
}) {
  return axios
    .post(
      `/api/projects/${projectSymbol}/documents/${versionId}/comments`,
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
  versionId,
  rootId,
  parentId,
  newComment
}) {
  return axios
    .post(
      `/api/projects/${projectSymbol}/documents/${versionId}/comments/${parentId}/reply`,
      {
        rootId,
        newComment
      }
    )
    .then(res => res.data);
}

export function postUpvoteToComment({
  projectSymbol,
  versionId,
  commentId,
  hasUpvoted
}) {
  return axios
    .post(
      `/api/projects/${projectSymbol}/documents/${versionId}/comments/${commentId}/upvote`,
      { commentId, hasUpvoted }
    )
    .then(res => res.data);
}

export function updateComment({
  projectSymbol,
  versionId,
  commentId,
  newComment,
  tags,
  issueOpen
}) {
  return axios
    .post(
      `/api/projects/${projectSymbol}/documents/${versionId}/comments/${commentId}/edit`,
      { newComment, tags, issueOpen }
    )
    .then(res => res.data);
}

export function postPendingCommentStatus({ comment, reviewed }) {
  return axios.post(`/api/projects/-/documents/-/comments/${comment.id}/verify`, {
    reviewed
  });
}

export function updateCommentIssueStatus({ comment, open }) {
  return axios.post(`/api/projects/-/documents/-/comments/${comment.id}/issue`, {
    open
  });
}
