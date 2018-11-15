import * as types from "./actionTypes.js";
import { getWizardSchemaById, postDocumentMetadata, putVersionContentJson } from "./services";
import history from '../../../history';

export function fetchStepArrayAndSchemas(wizardSchemaId) {
  return async (dispatch, getState) => {
    const wizardSchema = await getWizardSchemaById(wizardSchemaId);
    try {
      dispatch({
        type: types.STEP_ARRAY_AND_SCHEMAS_FETCH_SUCCESS,
        stepSchemas: wizardSchema.step_schemas_json,
        wizardStepArray: wizardSchema.step_array_json.wizardSteps,
        viewerStepArray: wizardSchema.step_array_json.viewerSteps
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

export function updateVersionContentJson(versionId) {
  return async (dispatch, getState) => {
    try {
      const currentFormData = getState().scenes.wizard.data.stepFormData;
      const versionData = await putVersionContentJson(versionId, currentFormData);
    } catch (err) {
      console.log(err);
    }
  }
}


export function submitDocumentMetadata({ title, description, project }) {
  const selectedProjectSymbol = project.symbol;
  return async (dispatch, getState) => {
    try {
      const currentDocument = getState().scenes.wizard.data.document;
      if (!currentDocument) {
        const version = await postDocumentMetadata({
          title,
          description,
          selectedProjectSymbol,
          projectId: project.id
        });
        const { document } = version;
        dispatch({
          type: types.DOCUMENT_METADATA_SUBMITTED,
          document,
          version,
          selectedProjectSymbol,
          project
        });
        console.log(version);
        history.push(`/wizard/step/3/version/${version.version_slug}`);
      } else {
        const document = await putDocumentMetadata({
          title,
          description,
          selectedProjectSymbol,
          projectId: project.id
        });
        dispatch({
          type: types.DOCUMENT_METADATA_SUBMITTED,
          document,
          project
        });
      }
    } catch (err) {}
  };
}
