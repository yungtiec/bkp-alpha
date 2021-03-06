import axios from "axios";

export function getWizardSchemaById(id) {
  return axios.get(`/api/wizard-schemas/${id}`).then(res => res.data);
}

export function putDocumentMetadata({ title, description, projectId, selectedProjectSymbol}) {
  return axios
    .put("/api/documents/:id", {
      title,
      description,
      selectedProjectSymbol,
      projectId
    })
    .then(res => res.data);
}

export function postDocumentMetadata({ title, description, projectId, selectedProjectSymbol }) {
  return axios
    .post("/api/documents", {
      title,
      description,
      selectedProjectSymbol,
      projectId,
      documentType: "scorecard"
    })
    .then(res => res.data);
}

export function putVersionContentJson(versionId, content) {
  return axios
    .put(`/api/versions/${versionId}/content-json`, {
      content_json: content
    })
    .then(res => res.data);
}
