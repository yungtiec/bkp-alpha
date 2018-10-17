import * as types from "./actionTypes.js";
import stepSchemas from "../../../../json-schema/step-schemas.json";
import { steps } from "../../../../json-schema/step-array.json";
import { postDocumentMetadata } from "./services";

export function fetchStepArrayAndSchemas() {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: types.STEP_ARRAY_AND_SCHEMAS_FETCH_SUCCESS,
        stepSchemas,
        stepArray: steps
      });
    } catch (error) {
      console.log(error);
      // Todos: error handling
    }
  };
}

export function updateFormDataInStore(formDataPath, formData) {
  return {
    type: types.FORM_DATA_IN_STORE_UPDATED,
    formData,
    formDataPath
  };
}

export function updateCurrentProject(project) {
  return {
    type: types.CURRENT_PROJECT_UPDATED,
    project
  };
}

export function submitDocumentMetadata({ description, projectId }) {
  return async (dispatch, getState) => {
    try {
      const currentDocument = getState().scenes.wizard.data.document;
      if (!currentDocument) {
        const { document, version } = await postDocumentMetadata({
          description,
          projectId
        });
        dispatch({
          type: types.DOCUMENT_METADATA_SUBMITTED,
          document,
          version
        });
      } else {
        const document = await putDocumentMetadata({
          description,
          projectId
        });
        dispatch({
          type: types.DOCUMENT_METADATA_SUBMITTED,
          document
        });
      }
    } catch (err) {}
  };
}
