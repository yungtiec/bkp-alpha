import axios from "axios";

export const getResponsibleIssues = ({ versionIds, offset, limit }) =>
  axios
    .get("/api/issues", {
      params: {
        versionIds,
        offset,
        limit
      }
    })
    .then(res => res.data);
