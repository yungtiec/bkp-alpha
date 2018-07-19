import axios from "axios";
import { keyBy } from "lodash";

export function getSurveyByProjectSurveyId(projectSymbol, projectSurveyId) {
  return axios
    .get(`/api/projects/${projectSymbol}/surveys/${projectSurveyId}`)
    .then(res => res.data);
}

export function postUpvoteToSurvey({ surveyId, projectSymbol, hasUpvoted }) {
  return axios
    .post(`/api/surveys/${surveyId}/upvote`, {
      hasUpvoted
    })
    .then(res => res.data);
}
