import * as types from "./actionTypes";
import { PROJECT_SURVEY_METADATA_FETCH_SUCCESS } from "../metadata/actionTypes";
import { uniq, isEmpty, values } from "lodash";

const initialState = {
  markdown: null,
  resolvedIssueIds: [],
  collaboratorEmails: [],
  collaboratorOptions: [],
  newIssues: [],
  commentPeriodValue: 3,
  commentPeriodUnit: "days",
  scorecard: {}
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
    case types.COLLABORATOR_OPTIONS_FETCHED_SUCCESS:
      return {
        ...state,
        collaboratorOptions: action.collaboratorOptions
      };
    case PROJECT_SURVEY_METADATA_FETCH_SUCCESS:
      return {
        ...state,
        collaboratorEmails: action.documentMetadata.document.collaborators.map(
          c => ({ label: c.email, value: c.email })
        ),
        scorecard: action.documentMetadata.scorecard
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
        newIssues: [],
        commentPeriodValue: 3,
        commentPeriodUnit: "days"
      };
    case types.ISSUE_SELECTED:
      return updateResolvedIssues(state, action);
    case types.COLLABORATOR_UPDATED:
      return {
        ...state,
        collaboratorEmails: action.collaboratorEmails
      };
    case types.ISSUE_ADDED:
    case types.ISSUE_DELETED:
      return updateNewIssues(state, action);
    case types.COMMENT_PERIOD_UNIT_UPDATED:
      return {
        ...state,
        commentPeriodUnit: action.commentPeriodUnit
      };
    case types.COMMENT_PERIOD_VALUE_UPDATED:
      return {
        ...state,
        commentPeriodValue: action.commentPeriodValue
      };
    case types.PROJECT_SCORECARD_UPDATED:
      return {
        ...state,
        scorecard: action.projectScorecard
      };
    default:
      return state;
  }
}

export function getImportedMarkdown(state) {
  return state.scenes.document.data.upload.markdown;
}

export function getResolvedIssueId(state) {
  return state.scenes.document.data.upload.resolvedIssueIds;
}

export function getCollaboratorEmails(state) {
  return state.scenes.document.data.upload.collaboratorEmails;
}

export function getCollaboratorOptions(state) {
  return state.scenes.document.data.upload.collaboratorOptions;
}

export function getNewIssues(state) {
  return state.scenes.document.data.upload.newIssues;
}

export function getCommentPeriodUnit(state) {
  return state.scenes.document.data.upload.commentPeriodUnit;
}

export function getCommentPeriodValue(state) {
  return state.scenes.document.data.upload.commentPeriodValue;
}
export function getProjectScorecardStatus(state) {
  const scorecard = state.scenes.document.data.upload.scorecard;
  return (
    !isEmpty(scorecard) &&
    values(scorecard).reduce((bool, score) => !!score && bool, true)
  );
}

export function getProjectScorecard(state) {
  return state.scenes.document.data.upload.scorecard;
}
