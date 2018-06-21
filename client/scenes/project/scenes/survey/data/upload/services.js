import axios from "axios";

export function postMarkdown({
  parentProjectSurveyId,
  markdown,
  resolvedIssueIds,
  newIssues,
  collaboratorEmails,
  commentPeriodInDay,
  scorecard
}) {
  return axios
    .post(`/api/projects/-/surveys/${parentProjectSurveyId}`, {
      markdown,
      resolvedIssueIds,
      newIssues,
      collaboratorEmails,
      commentPeriodInDay,
      scorecard
    })
    .then(res => res.data);
}
