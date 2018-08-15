import axios from "axios";

export function getQuestionsByVersionId(versionId) {
  return axios
    .get(`/api/versions/${versionId}/questions`)
    .then(res => res.data);
}
