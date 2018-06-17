import axios from "axios";
import { keyBy } from "lodash";

export function getProjectBySymbol(symbol) {
  return axios.get(`/api/projects/${symbol}`).then(res => res.data);
}

export function postProjectEditor({ symbol, projectEditorId, editorEmail }) {
  return axios
    .post(`/api/projects/${symbol}/editors`, { editorEmail })
    .then(res => res.data);
}

export function deleteProjectEditor({ symbol, projectEditorId }) {
  return axios
    .delete(`/api/projects/${symbol}/editors/${projectEditorId}`)
    .then(res => res.data);
}
