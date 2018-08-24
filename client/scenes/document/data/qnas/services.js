import axios from "axios";

export function getQuestionsByVersionId(versionId) {
  return axios
    .get(`/api/versions/${versionId}/questions`)
    .then(res => res.data);
}

export function postEditedQuestion({
  versionId,
  versionQuestionId,
  markdown,
  reverting
}) {
  return axios
    .post(`/api/versions/${versionId}/questions`, {
      versionQuestionId,
      markdown,
      reverting
    })
    .then(res => res.data);
}

export function postQuestionVersion({
  versionId,
  versionQuestionId,
  prevVersionQuestionId,
  reverting
}) {
  return axios
    .post(`/api/versions/${versionId}/questions`, {
      versionQuestionId,
      prevVersionQuestionId,
      reverting
    })
    .then(res => res.data);
}

export function postEditedAnswer({
  versionId,
  versionAnswerId,
  markdown,
  reverting
}) {
  return axios
    .post(`/api/versions/${versionId}/answers`, {
      versionAnswerId,
      markdown,
      reverting
    })
    .then(res => res.data);
}

export function postAnswerVersion({
  versionId,
  versionQuestionId,
  versionAnswerId,
  prevVersionAnswerId,
  reverting
}) {
  return axios
    .post(`/api/versions/${versionId}/answers`, {
      versionQuestionId,
      versionAnswerId,
      prevVersionAnswerId,
      reverting
    })
    .then(res => res.data);
}
