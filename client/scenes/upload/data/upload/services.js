import axios from "axios";

export function postMarkdown({
  markdown,
  versionNumber,
  collaboratorEmails,
  commentPeriodValue,
  commentPeriodUnit,
  selectedProjectSymbol,
  scorecard,
  // todo: add input for document type: regulatory...etc
  documentType
}) {
  return axios
    .post(`/api/documents`, {
      markdown,
      versionNumber,
      collaboratorEmails,
      commentPeriodValue,
      commentPeriodUnit,
      selectedProjectSymbol,
      scorecard,
      documentFormat: "markdown",
      documentType
    })
    .then(res => res.data);
}
