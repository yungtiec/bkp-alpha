import axios from "axios";

export function postUpvoteToDocument({
  documentId,
  projectSymbol,
  hasUpvoted,
  hasDownvoted
}) {
  return axios
    .post(`/api/documents/${documentId}/upvote`, {
      hasUpvoted,
      hasDownvoted
    })
    .then(res => res.data);
}

export function postDownvoteToDocument({
  documentId,
  projectSymbol,
  hasUpvoted,
  hasDownvoted
}) {
  return axios
    .post(`/api/documents/${documentId}/downvote`, {
      hasUpvoted,
      hasDownvoted
    })
    .then(res => res.data);
}

export function getMetadataByVersionId(versionId) {
  return axios.get(`/api/versions/${versionId}/metadata`).then(res => res.data);
}

export function putScorecard({ versionId, scorecard }) {
  return axios
    .put(`/api/versions/${versionId}/scorecard`, { scorecard })
    .then(res => res.data);
}
