import axios from "axios";

export const getPublishedProjectSurveyStats = () =>
  axios.get("/api/project/survey").then(res => res.data);
