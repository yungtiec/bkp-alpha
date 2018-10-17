import axios from "axios";

export function putDocumentMetadata({ title, description, projectId }) {
  return axios
    .put("/api/documents/:id", {
      title,
      description,
      projectId
    })
    .then(res => res.data);
}

export function postDocumentMetadata({ title, description, projectId }) {
  return axios
    .post("/api/documents", {
      title,
      description,
      projectId,
      documentType: "scorecard"
    })
    .then(res => res.data);
}
