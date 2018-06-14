import axios from "axios";

export function postMarkdown({
  parentProjectSurveyId,
  markdown,
  resolvedIssueIds,
  newIssues,
  collaboratorEmails,
  commentPeriodInDay
}) {
  return axios
    .post(`/api/projects/-/surveys/${parentProjectSurveyId}`, {
      markdown,
      resolvedIssueIds,
      newIssues,
      collaboratorEmails,
      commentPeriodInDay
    })
    .then(res => res.data);
}
