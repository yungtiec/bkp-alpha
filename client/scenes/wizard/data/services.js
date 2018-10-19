import axios from "axios";

export function getWizardSchemaById(id) {
  return axios.get(`/api/wizard-schemas/${id}`).then(res => res.data);
}

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
