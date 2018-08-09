import axios from "axios";

export function getQuestionsByProjectSurveyId(projectSurveyId) {
  return axios
    .get(`/api/project-surveys/${projectSurveyId}/questions`)
    .then(res => res.data);
}
