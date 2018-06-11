import * as types from "./actionTypes";
import { uniq } from "lodash";

const initialState = {
  markdown: null,
  collaboratorEmails: [],
  commentPeriodInDay: 7,
  selectedProjectId: ""
};

function updateCollaboratorEmails(state, action) {
  var collaboratorEmails;
  switch (action.type) {
    case types.COLLABORATOR_ADDED:
      collaboratorEmails = [action.collaboratorEmail].concat(
        state.collaboratorEmails
      );
      break;
    case types.COLLABORATOR_DELETED:
      collaboratorEmails = state.collaboratorEmails.filter(
        email => email !== action.collaboratorEmail
      );
      break;
    default:
      collaboratorEmails = state.collaboratorEmails;
      break;
  }
  return {
    ...state,
    collaboratorEmails: uniq(collaboratorEmails)
  };
}

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.MARKDOWN_IMPORTED:
      return {
        ...state,
        markdown: action.markdown
      };
    case types.MARKDOWN_UPLOADED:
      return {
        ...state,
        markdown: null,
        resolvedIssueIds: [],
        newIssues: []
      };
    case types.COLLABORATOR_ADDED:
    case types.COLLABORATOR_DELETED:
      return updateCollaboratorEmails(state, action);
    case types.COMMENT_PERIOD_UPDATED:
      return {
        ...state,
        commentPeriodInDay: action.commentPeriodInDay
      };
    case types.SELECTED_PROJECT_UPDATED:
      return {
        ...state,
        selectedProjectId: action.selectedProjectId
      };
    default:
      return state;
  }
}

export function getImportedMarkdown(state) {
  return state.scenes.upload.data.upload.markdown;
}

export function getCollaboratorEmails(state) {
  return state.scenes.upload.data.upload.collaboratorEmails;
}

export function getCommentPeriodInDay(state) {
  return state.scenes.upload.data.upload.commentPeriodInDay;
}

export function getSelectedProject(state) {
  return state.scenes.upload.data.upload.selectedProjectId;
}
