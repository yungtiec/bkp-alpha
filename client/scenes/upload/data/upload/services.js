import axios from "axios";

export function postMarkdown({
  markdown,
  versionNumber,
  collaboratorEmails,
  commentPeriodValue,
  commentPeriodUnit,
  selectedProjectSymbol,
  scorecard
}) {
  return axios
    .post(`/api/documents`, {
      markdown,
      versionNumber,
      collaboratorEmails,
      commentPeriodValue,
      commentPeriodUnit,
      selectedProjectSymbol,
      scorecard
    })
    .then(res => res.data);
}
