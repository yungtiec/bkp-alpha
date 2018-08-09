import axios from "axios";

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

export function getMetadataByProjectSurveyId(projectSurveyId) {
  return axios
    .get(`/api/project-surveys/${projectSurveyId}/metadata`)
    .then(res => res.data);
}
