import axios from "axios";

export function getCommentsBySurvey(projectSurveyId) {
  return axios
    .get("/api/comment", {
      params: {
        projectSurveyId
      }
    })
    .then(res => res.data);
}

export function postComment({ projectSurveyId, comment, tags, issueOpen }) {
  return axios
    .post("/api/comment", { projectSurveyId, comment, tags, issueOpen })
    .then(res => res.data);
}

export function postReplyToComment({ rootId, parentId, comment }) {
  return axios
    .post("/api/comment/reply", { rootId, parentId, comment })
    .then(res => res.data);
}

export function postUpvoteToComment({ commentId, hasUpvoted }) {
  return axios
    .post("/api/comment/upvote", { commentId, hasUpvoted })
    .then(res => res.data);
}

export function updateComment({
  commentId,
  comment,
  tags,
  issueOpen
}) {
  return axios
    .post("/api/comment/edit", { commentId, comment, tags, issueOpen })
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
