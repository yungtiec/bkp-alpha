import axios from "axios";

export const getResponsibleIssues = ({ projectSurveyIds, offset, limit }) =>
  axios
    .get("/api/users/-/issues", {
      params: {
        projectSurveyIds,
        offset,
        limit
      }
    })
    .then(res => res.data);
