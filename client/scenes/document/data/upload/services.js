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
  newResolvedIssues,
  collaboratorEmails,
  commentPeriodUnit,
  commentPeriodValue,
  versionNumber,
  scorecard
}) {
  return axios
    .post(`/api/documents/markdown/${parentVersionId}`, {
      markdown,
      resolvedIssueIds,
      newResolvedIssues,
      collaboratorEmails,
      commentPeriodUnit,
      commentPeriodValue,
      versionNumber,
      scorecard
    })
    .then(res => res.data);
}
