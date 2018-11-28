import axios from "axios";

export function getMetadataByVersionId(versionId) {
  return axios.get(`/api/versions/${versionId}/metadata`).then(res => res.data);
}

export function getMetadataByVersionSlug(version_slug) {
  return axios.get(`/api/versions/${version_slug}/metadata`).then(res => res.data);
}

export function putScorecard({ versionId, scorecard }) {
  return axios
    .put(`/api/versions/${versionId}/scorecard`, { scorecard })
    .then(res => res.data);
}
