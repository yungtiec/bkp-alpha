import axios from "axios";

export function getCollaboratorOptions(symbol) {
  return axios
    .get(`/api/projects/${symbol}/collaborator-options`)
    .then(res => res.data);
}

export function postMarkdown({
  parentProjectSurveyId,
  markdown,
  resolvedIssueIds,
  newIssues,
  collaboratorEmails,
  commentPeriodUnit,
  commentPeriodValue,
  scorecard
}) {
  return axios
    .post(`/api/surveys/${parentProjectSurveyId}`, {
      markdown,
      resolvedIssueIds,
      newIssues,
      collaboratorEmails,
      commentPeriodUnit,
      commentPeriodValue,
      scorecard
    })
    .then(res => res.data);
}
