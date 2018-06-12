import axios from "axios";
import { keyBy } from "lodash";

export function getProjectBySymbol(symbol) {
  return axios.get(`/api/projects/${symbol}`).then(res => res.data);
}
