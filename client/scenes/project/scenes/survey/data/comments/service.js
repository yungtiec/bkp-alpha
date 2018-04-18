import axios from "axios";

export function getCommentsBySurvey(projectSurveyId) {
  return axios
    .get("/api/survey/comment", {
      params: {
        projectSurveyId
      }
    })
    .then(res => res.data);
}

export function postComment({ projectSurveyId, comment }) {
  return axios
    .post("/api/survey/comment", { projectSurveyId, comment })
    .then(res => res.data);
}

export function postReplyToComment({ parentId, comment }) {
  return axios
    .post("/api/survey/comment/reply", { parentId, comment })
    .then(res => res.data);
}

export function postUpvoteToComment({ commentId, hasUpvoted }) {
  return axios
    .post("/api/survey/comment/upvote", { commentId, hasUpvoted })
    .then(res => res.data);
}

export function updateComment({ commentId, comment }) {
  return axios
    .post("/api/survey/comment/edit", { commentId, comment })
    .then(res => res.data);
}

export function postPendingCommentStatus({ commentId, reviewed }) {
  return axios.post("/api/survey/comment/verify", {
    commentId,
    reviewed
  });
}
