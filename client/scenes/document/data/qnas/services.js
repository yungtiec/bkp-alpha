import axios from "axios";

export function getQuestionsByVersionId(versionId) {
  return axios
    .get(`/api/version/${versionId}/questions`)
    .then(res => res.data);
}
