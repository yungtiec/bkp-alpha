import axios from "axios";

export function getOwnDrafts({ offset, limit }) {
  return axios
    .get(`/api/versions/drafts`, {
      params: {
        offset,
        limit
      }
    })
    .then(res => res.data);
}
