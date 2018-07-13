import axios from "axios";

export function postMarkdown({
  markdown,
  collaboratorEmails,
  commentPeriodValue,
  commentPeriodUnit,
  selectedProjectSymbol,
  scorecard
}) {
  return axios
    .post(`/api/projects/-/surveys/-`, {
      markdown,
      collaboratorEmails,
      commentPeriodValue,
      commentPeriodUnit,
      selectedProjectSymbol,
      scorecard
    })
    .then(res => res.data);
}
