import * as types from "./actionTypes";
import { keyBy, assignIn, omit, pick } from "lodash";
import {
  getProjectBySymbol,
  postProjectEditor,
  deleteProjectEditor
} from "./service";
import { notify } from "reapop";

export function fetchProjectBySymbol(symbol) {
  return async (dispatch, getState) => {
    try {
      const currentProject = getState().scenes.project.data.metadata;
      if (currentProject.symbol === symbol) return;
      const project = await getProjectBySymbol(symbol);
      const projectMetadata = omit(project, ["surveys"]);
      const surveysById = keyBy(project.surveys, "id");
      const surveyIds = project.surveys.map(ps => ps.id);
      dispatch({
        type: types.PROJECT_FETCH_SUCCESS,
        projectMetadata,
        surveysById,
        surveyIds
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function addEditor(editorEmail) {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const projectMetadata = state.scenes.project.data.metadata;
      const symbol = state.scenes.project.data.metadata.symbol;
      const projectEditor = await postProjectEditor({ symbol, editorEmail });
      dispatch({
        type: types.PROJECT_EDITOR_ADDED,
        projectEditor
      });
      dispatch({
        type: "modal.UPDATE_MODAL_PROPS",
        modalProps: {
          currentEditors: projectMetadata.currentEditors.concat(projectEditor),
          projectAdmins: projectMetadata.admins
        }
      });
    } catch (err) {
      // notify
      if (err.response && err.response.status === 404) {
        dispatch(
          notify({
            title: "User not found",
            message: "",
            status: "error",
            dismissible: true,
            dismissAfter: 3000
          })
        );
      } else if (err.response && err.response.status === 500) {
        dispatch(
          notify({
            title:
              err.response.data && err.response.data.message
                ? err.response.data.message
                : err.response.statusText,
            message: "",
            status: "error",
            dismissible: true,
            dismissAfter: 3000
          })
        );
      }
      console.log(err, err.response);
    }
  };
}

export function removeEditor(projectEditorId) {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const projectMetadata = state.scenes.project.data.metadata;
      const symbol = projectMetadata.symbol;
      await deleteProjectEditor({ symbol, projectEditorId });
      dispatch({
        type: types.PROJECT_EDITOR_REMOVED,
        projectEditorId
      });
      dispatch({
        type: "modal.UPDATE_MODAL_PROPS",
        modalProps: {
          currentEditors: projectMetadata.currentEditors.filter(
            e => e.project_editor.id !== projectEditorId
          ),
          projectAdmins: projectMetadata.admins
        }
      });
    } catch (err) {
      // notify
      console.log(err);
    }
  };
}
