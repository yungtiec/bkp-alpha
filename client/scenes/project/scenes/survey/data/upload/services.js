import axios from "axios";

export function postMarkdown(parentProjectSurveyId, markdown) {
  return axios.post(`/api/upload/${parentProjectSurveyId}`, {
    markdown
  });
}
