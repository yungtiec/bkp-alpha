import axios from "axios";

export function postMarkdown({
  markdown,
  collaboratorEmails,
  commentPeriodInDay,
  selectedProjectSymbol
}) {
  return axios
    .post(`/api/projects/-/surveys/-`, {
      markdown,
      collaboratorEmails,
      commentPeriodInDay,
      selectedProjectSymbol
    })
    .then(res => res.data);
}
