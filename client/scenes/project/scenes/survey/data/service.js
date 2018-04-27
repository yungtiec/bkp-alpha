import axios from "axios";
import { keyBy } from "lodash";

export function getSurveyByProjectSurveyId(projectSurveyId) {
  return axios
    .get(`/api/project/survey/${projectSurveyId}`)
    .then(res => res.data);
}
