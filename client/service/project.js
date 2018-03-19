var projectData = require('../mock-data/project')
var subcategories = require('../mock-data/subcategory')
import { keyBy, assignIn, omit, pick } from "lodash";

export function getAllProjects() {
  return projectData.map(p => omit(p, ['project_surveys']))
}

export function getProjectBySymbol(symbol) {
  return keyBy(projectData, 'symbol')[symbol]
}
