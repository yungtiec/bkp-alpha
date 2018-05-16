import axios from "axios";

export function getEngagementItems(projectSurveyId) {
  return axios
    .get(`/api/admin/project-survey/${projectSurveyId}`)
    .then(res => res.data);
}

export function postPendingEngagementItemStatus(engagementItem, reviewed) {
  return axios.post("/api/admin/engagement-item/verify", {engagementItem, reviewed})
}

export function updateEngagementItemIssueStatus({ engagementItem, open }) {
  return axios.post("/api/admin/engagement-item/issue", {
    engagementItem,
    open
  });
}
