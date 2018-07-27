import axios from "axios";
import { keyBy } from "lodash";

export function getSurveyByProjectSurveyId(projectSymbol, projectSurveyId) {
  return axios
    .get(`/api/projects/${projectSymbol}/surveys/${projectSurveyId}`)
    .then(res => res.data);
}

export function postUpvoteToProjectSurvey({
  projectSurveyId,
  projectSymbol,
  hasUpvoted,
  hasDownvoted
}) {
  return axios
    .post(`/api/projects/${projectSymbol}/surveys/${projectSurveyId}/upvote`, {
      hasUpvoted,
      hasDownvoted
    })
    .then(res => res.data);
}

export function postDownvoteToProjectSurvey({
  projectSurveyId,
  projectSymbol,
  hasUpvoted,
  hasDownvoted
}) {
  return axios
    .post(
      `/api/projects/${projectSymbol}/surveys/${projectSurveyId}/downvote`,
      {
        hasUpvoted,
        hasDownvoted
      }
    )
    .then(res => res.data);
}
