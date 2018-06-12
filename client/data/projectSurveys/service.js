import axios from "axios";

export const getPublishedProjectSurveyStats = () =>
  axios.get("/api/projects/-/surveys").then(res => res.data);
