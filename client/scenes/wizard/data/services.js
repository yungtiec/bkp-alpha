import axios from "axios";

export function getWizardSchemaById(id) {
  return axios.get(`/api/wizard-schemas/${id}`).then(res => res.data);
}

export function putDocumentMetadata({
  documentId,
  title,
  description,
  projectId,
  selectedProjectSymbol
}) {
  return axios
    .put(`/api/documents/${documentId}`, {
      title,
      description,
      selectedProjectSymbol,
      project_id: projectId
    })
    .then(res => res.data);
}

export function postDocumentWithSchemaId(wizardSchemaId) {
  return axios
    .post("/api/documents", {
      wizardSchemaId,
      documentFormat: "wizard",
      documentType: "scorecard"
    })
    .then(res => res.data);
}

export function getDraftBySlug(versionSlug) {
  return axios
    .get(`/api/documents/drafts/${versionSlug}`)
    .then(res => res.data);
}

export function postDocumentMetadata({
  title,
  description,
  projectId,
  selectedProjectSymbol
}) {
  return axios
    .post("/api/documents", {
      title,
      description,
      selectedProjectSymbol,
      projectId,
      documentFormat: "wizard",
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
