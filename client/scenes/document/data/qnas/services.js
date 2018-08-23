import axios from "axios";

export function getQuestionsByVersionId(versionId) {
  return axios
    .get(`/api/versions/${versionId}/questions`)
    .then(res => res.data);
}

export function postEditedQuestion({ versionQuestionId, markdown, reverting }) {
  return axios
    .post(`/api/versions/-/questions`, {
      versionQuestionId,
      markdown,
      reverting
    })
    .then(res => res.data);
}

export function postEditedAnswer({ versionAnswerId, markdown, reverting }) {
  return axios
    .post(`/api/versions/-/answers`, {
      versionAnswerId,
      markdown,
      reverting
    })
    .then(res => res.data);
}
