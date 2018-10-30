import React, { Fragment } from "react";
import templates from "./index";
import { connect } from "react-redux";
import { getStepFormData } from "../../data/reducer";
import { updateFormDataInStore } from "../../data/actions";
import { getStepArrayAndSchemas } from "../../data/reducer";
import { loadModal } from "../../../../data/reducer";
import { cloneDeep } from "lodash";
import SelectWidget from "../widgets/SelectWidget";

function SelectCollectionTemplate(props) {
  var {
    loadModal,
    updateFormDataInStore,
    stepFormData,
    stepSchemas,
    schema,
    idSchema,
    title,
    uiSchema,
    required,
    formContext,
    formData,
    items,
    onAddClick,
    ...otherProps
  } = props;

  var options = {};

  if (schema["enum:optionDependencyPath"])
    options.enumOptions = schema["enum:defaultOptions"].concat(
      stepFormData[schema["enum:optionDependencyPath"]].map(entry => ({
        value: entry,
        label: entry[schema["enum:optionDependencyLabelKey"]]
      }))
    );

  return (
    <Fragment>
      {uiSchema["ui:title"] && uiSchema["ui:title"].hideTitle
        ? null
        : (uiSchema["ui:title"] || title) && (
            <props.TitleTemplate
              id={`${idSchema.$id}__title`}
              title={title || uiSchema["ui:title"]}
              required={required}
              formContext={formContext}
            />
          )}
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
          formDataPath: schema["enum:optionDependencyPath"]
        })}
        onChange={selectOptions =>
          onAddClick({ preventDefault: () => {} }, selectOptions)
        }
        {...otherProps}
        value={formData.map(d => d.value)}
      />
    </Fragment>
  );
}

/**
 * TODO: PropTypes
 */

const mapState = (state, ownProps) => {
  const { stepArray, stepSchemas } = getStepArrayAndSchemas(state);
  return {
    ...ownProps,
    stepFormData: getStepFormData(state),
    stepArray,
    stepSchemas
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
)(SelectCollectionTemplate);
