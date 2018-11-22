import axios from "axios";

export function getOwnPublishedDocuments({ offset, limit }) {
  return axios
    .get(`/api/versions/published`, {
      params: {
        offset,
        limit
      }
    })
    .then(res => res.data);
}
