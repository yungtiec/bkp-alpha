import axios from "axios";

export function getOwnDrafts({ offset, limit }) {
  return axios
    .get(`/api/documents/drafts`, {
      params: {
        offset,
        limit
      }
    })
    .then(res => res.data);
}
