import * as types from "./actionTypes";
import { assignIn } from "lodash";

const initialState = {
  issuesById: null,
  issueIds: null,
  issues: null,
  issueOffset: 0,
  issueLimit: 10,
  issueCount: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RESPONSIBLE_ISSUES_FETCHED_SUCESSS:
      return {
        ...state,
        issuesById: assignIn(action.issuesById, state.issuesById),
        issueIds: (state.issueIds || []).concat(action.issueIds),
        issueOffset: action.issueOffset,
        issueCount: action.count
      };
    default:
      return state;
  }
}

export function getResponsibleIssues(state) {
  return {
    issuesById: state.scenes.dashboard.data.issuesById,
    issueIds: state.scenes.dashboard.data.issueIds
  };
}

export function canLoadMore(state) {
  return (
    state.scenes.dashboard.data.issueOffset <
    state.scenes.dashboard.data.issueCount
  );
}
