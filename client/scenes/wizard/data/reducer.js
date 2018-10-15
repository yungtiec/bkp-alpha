import * as types from "./actionTypes";
import { set, cloneDeep } from "lodash";

const initialState = {
  stepArray: null,
  stepSchemas: null,
  stepFormData: {}
};

const getInitialStepFormData = (stepArray, stepSchemas) => {
  var stepFormData = {};
  stepArray.forEach(step => {
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

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.STEP_ARRAY_AND_SCHEMAS_FETCH_SUCCESS:
      return {
        ...state,
        ...action,
        stepFormData: getInitialStepFormData(
          action.stepArray,
          action.stepSchemas
        )
      };
    case types.FORM_DATA_IN_STORE_UPDATED:
      return updateFormData(action, state);
    default:
      return state;
  }
}

export const getStepArrayAndSchemas = state => state.scenes.wizard.data;

export const getStepFormData = state => state.scenes.wizard.data.stepFormData;
