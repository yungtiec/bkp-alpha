import * as types from "./actionTypes";
import { SURVEY_FETCH_SUCCESS } from "../actionTypes";
import { uniq } from "lodash";

const initialState = {
  markdown: null,
  resolvedIssueIds: [],
  collaboratorEmails: [],
  newIssues: [],
  commentPeriodInDay: 7
};

function updateResolvedIssues(state, action) {
  var resolvedIssueIds;
  if (state.resolvedIssueIds.indexOf(action.issueId) !== -1) {
    resolvedIssueIds = state.resolvedIssueIds.filter(
      id => id !== action.issueId
    );
  } else {
    resolvedIssueIds = state.resolvedIssueIds.concat([action.issueId]);
  }
  return {
    ...state,
    resolvedIssueIds
  };
}

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

function updateNewIssues(state, action) {
  var newIssues;
  switch (action.type) {
    case types.ISSUE_ADDED:
      newIssues = [action.issue].concat(state.newIssues);
      break;
    case types.ISSUE_DELETED:
      newIssues = state.newIssues.filter(issue => issue !== action.issue);
      break;
    default:
      newIssues = state.newIssues;
      break;
  }
  return {
    ...state,
    newIssues: uniq(newIssues)
  };
}

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case SURVEY_FETCH_SUCCESS:
      return {
        ...state,
        collaboratorEmails: action.surveyMetadata.collaborators.map(
          c => c.email
        )
      };
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
    case types.ISSUE_SELECTED:
      return updateResolvedIssues(state, action);
    case types.COLLABORATOR_ADDED:
    case types.COLLABORATOR_DELETED:
      return updateCollaboratorEmails(state, action);
    case types.ISSUE_ADDED:
    case types.ISSUE_DELETED:
      return updateNewIssues(state, action);
    case types.COMMENT_PERIOD_UPDATED:
      return {
        ...state,
        commentPeriodInDay: action.commentPeriodInDay
      };
    default:
      return state;
  }
}

export function getImportedMarkdown(state) {
  return state.scenes.project.scenes.survey.data.upload.markdown;
}

export function getResolvedIssueId(state) {
  return state.scenes.project.scenes.survey.data.upload.resolvedIssueIds;
}

export function getCollaboratorEmails(state) {
  return state.scenes.project.scenes.survey.data.upload.collaboratorEmails;
}

export function getNewIssues(state) {
  return state.scenes.project.scenes.survey.data.upload.newIssues;
}

export function getCommentPeriodInDay(state) {
  return state.scenes.project.scenes.survey.data.upload.commentPeriodInDay;
}
