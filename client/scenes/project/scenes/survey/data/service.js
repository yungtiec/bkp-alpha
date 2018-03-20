var projectData = require("../../../../../mock-data/project");
import { keyBy } from "lodash";

export function getProjectBySymbol(symbol) {
  return keyBy(projectData, "symbol")[symbol];
}
