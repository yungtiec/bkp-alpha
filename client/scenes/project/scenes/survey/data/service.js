import axios from "axios";
import { keyBy } from "lodash";

export function getSurveyByProjectSurveyId(projectSymbol, projectSurveyId) {
  return axios
    .get(`/api/projects/${projectSymbol}/surveys/${projectSurveyId}`)
    .then(res => res.data);
}

<<<<<<< HEAD
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
=======
export function postUpvoteToSurvey({ surveyId, projectSymbol, hasUpvoted }) {
  return axios
    .post(`/api/surveys/${surveyId}/upvote`, {
      hasUpvoted
>>>>>>> db-refactor
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
