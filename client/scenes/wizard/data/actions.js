import * as types from "./actionTypes.js";
import stepSchemas from "../../../../json-schema/step-schemas.json";
import { steps } from "../../../../json-schema/step-array.json";

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
