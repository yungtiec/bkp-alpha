import * as types from "./actionTypes";
import { uniq } from "lodash";

const initialState = {
  markdown: null,
  collaboratorEmails: [],
  commentPeriodInDay: 7,
  selectedProject: "",
  projectSymbolArr: [],
  projectsBySymbol: {},
  collaboratorOptions: []
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.MANAGED_PROJECTS_FETCH_SUCCESS:
      return {
        ...state,
        projectSymbolArr: action.projectSymbolArr,
        projectsBySymbol: action.projectsBySymbol
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
        collaboratorEmails: [],
        commentPeriodInDay: 7,
        selectedProject: ""
      };
    case types.COLLABORATOR_UPDATED:
      return {
        ...state,
        collaboratorEmails: action.collaboratorEmails
      };
    case types.COMMENT_PERIOD_UPDATED:
      return {
        ...state,
        commentPeriodInDay: action.commentPeriodInDay
      };
    case types.SELECTED_PROJECT_UPDATED:
      return {
        ...state,
        selectedProject: action.selectedProject,
        collaboratorOptions: action.selectedProject.collaboratorOptions
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
  return state.scenes.upload.data.upload.selectedProject;
}

export function getCollaboratorOptions(state) {
  return state.scenes.upload.data.upload.collaboratorOptions;
}

export function getManagedProjects(state) {
  const {
    projectSymbolArr,
    projectsBySymbol
  } = state.scenes.upload.data.upload;
  return {
    projectSymbolArr,
    projectsBySymbol
  };
}
