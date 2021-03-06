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

const getInitialStepFormData = (wizardStepArray, stepSchemas) => {
  var stepFormData = {};
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

const initStepStatus = (state, action) => {

}

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
