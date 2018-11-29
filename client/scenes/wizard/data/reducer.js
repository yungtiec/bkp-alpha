import * as types from "./actionTypes";
import { set, cloneDeep } from "lodash";

const initialState = {
  version: null,
  document: null,
  project: null,
  wizardStepArray: null,
  viewerStepArray: null,
  stepSchemas: null,
  stepStatus: {},
  stepFormData: {}
};

const getInitialStepFormData = (wizardStepArray, stepSchemas, formData) => {
  var stepFormData = {};
  if (formData) return formData;
  wizardStepArray.forEach(step => {
    if (
      step.childComponentType === "JSON_SCHEMA_FORMS_ACCORDION" ||
      step.childComponentType === "JSON_SCHEMA_FORM"
    ) {
      stepFormData[step.id] = {};
      if (step.childComponentType === "JSON_SCHEMA_FORM")
        stepFormData[step.id] = stepSchemas[step.id].defaultFormData;
      if (step.childComponentType === "JSON_SCHEMA_FORMS_ACCORDION")
        stepSchemas[step.id].accordionOrder.forEach(key => {
          stepFormData[step.id][key] =
            stepSchemas[step.id][key].defaultFormData;
        });
    }
  });
  return stepFormData;
};

const updateFormData = ({ formData, formDataPath }, state) => {
  set(state.stepFormData, formDataPath, formData);
  return state;
};

const initStepStatus = (state, action) => {};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.STEP_ARRAY_AND_SCHEMAS_FETCH_SUCCESS:
      return {
        ...state,
        ...action,
        stepFormData: getInitialStepFormData(
          action.wizardStepArray,
          action.stepSchemas
        )
      };
    case types.DOCUMENT_CREATED:
      return {
        ...state,
        stepFormData: getInitialStepFormData(
          action.wizardSchema.step_array_json.wizardSteps,
          action.wizardSchema.step_schemas_json,
          action.version.content_json
        ),
        stepSchemas: action.wizardSchema.step_schemas_json,
        wizardStepArray: action.wizardSchema.step_array_json.wizardSteps,
        viewerStepArray: action.wizardSchema.step_array_json.viewerSteps,
        version: action.version,
        document: action.document
      };
    case types.DOCUMENT_AND_SCHEMAS_FETCHED_SUCCESS:
      return {
        ...state,
        stepFormData: getInitialStepFormData(
          action.wizardSchema.step_array_json.wizardSteps,
          action.wizardSchema.step_schemas_json,
          action.version.content_json
        ),
        stepSchemas: action.wizardSchema.step_schemas_json,
        wizardStepArray: action.wizardSchema.step_array_json.wizardSteps,
        viewerStepArray: action.wizardSchema.step_array_json.viewerSteps,
        version: action.version,
        document: action.document,
        project: action.project
      };
    case types.FORM_DATA_IN_STORE_UPDATED:
      return updateFormData(action, cloneDeep(state));
    case types.CURRENT_PROJECT_UPDATED:
      return {
        ...state,
        project: action.project
      };
    case types.DOCUMENT_METADATA_SUBMITTED:
      return {
        ...state,
        ...action
      };
    default:
      return state;
  }
}

export const getStepArrayAndSchemas = state => state.scenes.wizard.data;

export const getStepFormData = state => state.scenes.wizard.data.stepFormData;

export const getCurrentProject = state => state.scenes.wizard.data.project;

export const getCurrentDocument = state => state.scenes.wizard.data.document;

export const getCurrentVersion = state => state.scenes.wizard.data.version;
