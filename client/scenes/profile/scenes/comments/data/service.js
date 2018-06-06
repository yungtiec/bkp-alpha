import axios from "axios";

export function getUserComments({
  userId,
  offset,
  limit,
  projects,
  surveys,
  reviewStatus = [],
  issueStatus = []
} = {}) {
  return axios
    .get(`/api/users/${userId}/comments`, {
      params: {
        offset,
        limit,
        projects,
        surveys,
        reviewStatus,
        issueStatus
      }
    })
    .then(res => res.data);
}
