import axios from "axios";

export function putDocumentMetadata({ description, projectId }) {
  return axios
    .put("api/documents/:id", {
      description,
      projectId
    })
    .then(res => res.data);
}

export function postDocumentMetadata({ description, projectId }) {
  return axios
    .post("api/documents", {
      description,
      projectId,
      document_type: "scorecard"
    })
    .then(res => res.data);
}
