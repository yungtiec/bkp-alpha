import axios from "axios";

export function putProjectForDocument(projectId) {
  return axios
    .put("api/documents/:id/project/:projectId")
    .then(res => res.data);
}

export function postDocumentForProject(projectId) {
  return axios
    .post("api/documents", {
      description,
      projectId,
      document_type: "scorecard"
    })
    .then(res => res.data);
}
