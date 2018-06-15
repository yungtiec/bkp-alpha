import axios from "axios";

export function getManagedProjects() {
  return axios.get(`api/users/-/projects`).then(res => res.data);
}

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
