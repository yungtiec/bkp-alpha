import axios from "axios";

export function getQuestionsByVersionId(versionId) {
  return axios
    .get(`/api/versions/${versionId}/questions`)
    .then(res => res.data);
}

export function getLatestQuestionsByDocumentId(documentId) {
  return axios
    .get(`/api/documents/${documentId}/questions`)
    .then(res => res.data);
}

export function postEditedQuestion({ versionId, versionQuestionId, markdown }) {
  return axios
    .post(`/api/versions/${versionId}/questions`, {
      versionQuestionId,
      markdown
    })
    .then(res => res.data);
}

export function putQuestionVersion({
  versionId,
  versionQuestionId,
  prevVersionQuestionId
}) {
  return axios
    .put(`/api/versions/${versionId}/questions`, {
      versionQuestionId,
      prevVersionQuestionId
    })
    .then(res => res.data);
}

export function postEditedAnswer({ versionId, versionAnswerId, markdown }) {
  return axios
    .post(`/api/versions/${versionId}/answers`, {
      versionAnswerId,
      markdown
    })
    .then(res => res.data);
}

export function putAnswerVersion({
  versionId,
  versionQuestionId,
  versionAnswerId,
  prevVersionAnswerId
}) {
  return axios
    .put(`/api/versions/${versionId}/answers`, {
      versionQuestionId,
      versionAnswerId,
      prevVersionAnswerId
    })
    .then(res => res.data);
}
