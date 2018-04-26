var projectData = require("../../../mock-data/project");
import axios from "axios";
import { keyBy } from "lodash";

export function getProjectBySymbol(symbol) {
  return axios.get(`/api/project/${symbol}`).then(res => res.data);
}
