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
  hasUpvoted
}) {
  return axios
    .post(`/api/projects/${projectSymbol}/surveys/${projectSurveyId}/upvote`, {
      hasUpvoted
    })
    .then(res => res.data);
}
