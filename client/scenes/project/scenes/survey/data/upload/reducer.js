import * as types from "./actionTypes";
import { PROJECT_SURVEY_FETCH_SUCCESS } from "../actionTypes";
import { PROJECT_FETCH_SUCCESS } from "../../../../data/actionTypes";
import { uniq, isEmpty, values } from "lodash";

const initialState = {
  markdown: null,
  resolvedIssueIds: [],
  collaboratorEmails: [],
  collaboratorOptions: [],
  newIssues: [],
  commentPeriodInDay: 7,
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
    case PROJECT_FETCH_SUCCESS:
      return {
        ...state,
        collaboratorOptions: action.projectMetadata.collaboratorOptions
      };
    case PROJECT_SURVEY_FETCH_SUCCESS:
      return {
        ...state,
        collaboratorEmails: action.surveyMetadata.collaborators.map(
          c => c.email
        ),
        scorecard: action.surveyMetadata.scorecard
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
    case types.COLLABORATOR_UPDATED:
      return {
        ...state,
        collaboratorEmails: action.collaboratorEmails
      };
    case types.ISSUE_ADDED:
    case types.ISSUE_DELETED:
      return updateNewIssues(state, action);
    case types.COMMENT_PERIOD_UPDATED:
      return {
        ...state,
        commentPeriodInDay: action.commentPeriodInDay
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
  return state.scenes.project.scenes.survey.data.upload.markdown;
}

export function getResolvedIssueId(state) {
  return state.scenes.project.scenes.survey.data.upload.resolvedIssueIds;
}

export function getCollaboratorEmails(state) {
  return state.scenes.project.scenes.survey.data.upload.collaboratorEmails;
}

export function getCollaboratorOptions(state) {
  return state.scenes.project.scenes.survey.data.upload.collaboratorOptions;
}

export function getNewIssues(state) {
  return state.scenes.project.scenes.survey.data.upload.newIssues;
}

export function getCommentPeriodInDay(state) {
  return state.scenes.project.scenes.survey.data.upload.commentPeriodInDay;
}

export function getProjectScorecardStatus(state) {
  const scorecard = state.scenes.project.scenes.survey.data.upload.scorecard;
  return (
    !isEmpty(scorecard) &&
    values(scorecard).reduce((bool, score) => !!score && bool, true)
  );
}

export function getProjectScorecard(state) {
  return state.scenes.project.scenes.survey.data.upload.scorecard;
}
