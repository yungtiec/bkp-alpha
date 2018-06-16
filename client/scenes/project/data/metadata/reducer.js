import _ from "lodash";
import * as types from "../actionTypes";

const initialState = {};

function addEditor(state, action) {
  state.currentEditors = state.currentEditors.concat(action.projectEditor);
  state.editors = state.editors.concat(action.projectEditor);
  return state;
}

function removeEditor(state, action) {
  state.currentEditors = state.currentEditors.filter(
    e => e.project_editor.id !== action.projectEditorId
  );
  state.editors = state.editors.filter(
    e => e.project_editor.id !== action.projectEditorId
  );
  return state;
}

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_FETCH_SUCCESS:
      return {
        ...state,
        ...action.projectMetadata,
        currentEditors: _.cloneDeep(action.projectMetadata.editors) || []
      };
    case types.PROJECT_EDITOR_ADDED:
      return addEditor(_.cloneDeep(state), action);
    case types.PROJECT_EDITOR_REMOVED:
      return removeEditor(_.cloneDeep(state), action);
    default:
      return state;
  }
}

export function getSelectedProject(state) {
  return state.scenes.project.data.metadata;
}
