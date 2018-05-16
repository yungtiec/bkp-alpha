import axios from "axios";

export function getUserAnnotations({
  userId,
  offset,
  limit,
  projects,
  surveys,
  reviewStatus = [],
  issueStatus = []
} = {}) {
  return axios
    .get(`/api/users/${userId}/annotations`, {
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
