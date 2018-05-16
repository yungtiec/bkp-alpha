import axios from "axios";

export function getUserProjectSurveyComments({
  userId,
  offset,
  limit,
  projects,
  surveys,
  reviewStatus = [],
  issueStatus = []
} = {}) {

  return axios
    .get(`/api/users/${userId}/project-survey-comments`, {
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
