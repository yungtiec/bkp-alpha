import axios from "axios";

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
    .post(`/api/projects/-/surveys/${parentProjectSurveyId}`, {
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
