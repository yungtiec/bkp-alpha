import axios from "axios";

export const getLastestDocumentsWithStats = ({ offset, limit }) =>
  axios
    .get("/api/documents", {
      params: {
        offset,
        limit
      }
    })
    .then(res => res.data);
