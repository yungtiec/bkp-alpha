import axios from "axios";

export function postMarkdown({
  markdown,
  collaboratorEmails,
  commentPeriodInDay,
  selectedProjectId
}) {
  return axios
    .post(`/api/upload`, {
      markdown,
      collaboratorEmails,
      commentPeriodInDay,
      selectedProjectId
    })
    .then(res => res.data);
}
