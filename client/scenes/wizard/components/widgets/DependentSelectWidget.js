import React from "react";
import { connect } from "react-redux";
import {
  getStepFormData,
  getCurrentVersion,
  getStepArrayAndSchemas
} from "../../data/reducer";
import {
  updateFormDataInStore,
  updateVersionContentJson
} from "../../data/actions";
import { loadModal } from "../../../../data/reducer";
import { cloneDeep } from "lodash";

import SelectWidget from "./SelectWidget";

const DependentSelectWidget = props => {
  var {
    loadModal,
    updateFormDataInStore,
    stepFormData,
    stepSchemas,
    schema,
    options,
    version,
    ...otherProps
  } = props;
  var addSouceOption = {
    label: "Add another source",
    value: "LOAD_SELECT_CREATABLE_MODAL"
  };

  if (schema["enum:optionDependencyPath"])
    options.enumOptions = stepFormData[schema["enum:optionDependencyPath"]].map(
      entry => ({
        value: entry,
        label: entry[schema["enum:optionDependencyLabelKey"]]
      })
    );

  if (!options.enumOptions[0].label) options.enumOptions = [addSouceOption];
  else options.enumOptions.push(addSouceOption);

  return (
    <SelectWidget
      multiple={true}
      creatable={true}
      schema={schema}
      options={options}
      loadModal={loadModal}
      updateFormDataInStore={updateFormDataInStore}
      modalProps={cloneDeep({
        schema: stepSchemas[schema["enum:optionDependencyPath"]].schema,
        uiSchema: stepSchemas[schema["enum:optionDependencyPath"]].uiSchema,
        formData: stepFormData[schema["enum:optionDependencyPath"]],
        formDataPath: schema["enum:optionDependencyPath"],
        version
      })}
      {...otherProps}
    />
  );
};

const mapState = (state, ownProps) => {
  const { wizardStepArray, stepSchemas } = getStepArrayAndSchemas(state);
  return {
    ...ownProps,
    stepFormData: getStepFormData(state),
    wizardStepArray,
    stepSchemas,
    version: getCurrentVersion(state)
  };
};

const mapDispatch = (dispatch, ownProps) => {
  return {
    updateFormDataInStore: formData =>
      dispatch(
        updateFormDataInStore(
          ownProps.schema["enum:optionDependencyPath"],
          formData
        )
      ),
    loadModal: (modalType, modalProps) =>
      dispatch(loadModal(modalType, modalProps))
  };
};

export default connect(
  mapState,
  mapDispatch
)(DependentSelectWidget);
