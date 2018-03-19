var projectData = require('../../../../mock-data/project')
import { omit } from "lodash";

export function getAllProjects() {
  return projectData.map(p => omit(p, ['project_surveys']))
}
