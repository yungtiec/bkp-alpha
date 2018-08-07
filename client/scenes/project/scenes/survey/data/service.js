import axios from "axios";
import { keyBy } from "lodash";

export function getSurveyByProjectSurveyId(projectSymbol, projectSurveyId) {
  return axios
    .get(`/api/projects/${projectSymbol}/surveys/${projectSurveyId}`)
    .then(res => res.data);
}

export function postUpvoteToSurvey({
  surveyId,
  projectSymbol,
  hasUpvoted,
  hasDownvoted
}) {
  return axios
    .post(`/api/surveys/${surveyId}/upvote`, {
      hasUpvoted,
      hasDownvoted
    })
    .then(res => res.data);
}

export function postDownvoteToSurvey({
  surveyId,
  projectSymbol,
  hasUpvoted,
  hasDownvoted
}) {
  return axios
    .post(`/api/surveys/${surveyId}/downvote`, {
      hasUpvoted,
      hasDownvoted
    })
    .then(res => res.data);
}
