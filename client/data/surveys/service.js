import axios from "axios";

export const getLastestSurveysWithStats = ({ offset, limit }) =>
  axios
    .get("/api/surveys", {
      params: {
        offset,
        limit
      }
    })
    .then(res => res.data);
