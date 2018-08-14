import axios from "axios";

export function getCollaboratorOptions(symbol) {
  return axios
    .get(`/api/projects/${symbol}/collaborator-options`)
    .then(res => res.data);
}

export function postMarkdown({
  parentVersionId,
  markdown,
  resolvedIssueIds,
  newIssues,
  collaboratorEmails,
  commentPeriodUnit,
  commentPeriodValue,
  scorecard
}) {
  return axios
    .post(`/api/documents/${parentVersionId}`, {
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
