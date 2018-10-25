import React from "react";
import PropTypes from "prop-types";
import Select, { Creatable } from "react-select";
import { cloneDeep } from "lodash";

import { asNumber } from "@react-schema-form/core/src/utils";

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue({ type, items }, selectedOptions) {
  var value = selectedOptions.length
    ? selectedOptions
    : selectedOptions.value;
  if (value === "") {
    return undefined;
  } else if (
    type === "array" &&
    items &&
    ["number", "integer"].includes(items.type)
  ) {
    return value.map(asNumber);
  } else if (type === "boolean") {
    return value === "true";
  } else if (type === "number") {
    return asNumber(value);
  }
  return value;
}

function getValue(selectedOptions, multiple) {
  if (multiple) {
    return selectedOptions.map(o => o.value);
  } else {
    return selectedOptions.value;
  }
}

function selectOnChange({
  onChange,
  selectedOptions,
  schema,
  creatable,
  updateFormDataInStore,
  loadModal,
  modalProps
}) {
  // if creatable and option value is LOAD_SELECT_CREATABLE_MODAL, invoke loadModal
  // render "enum:optionDependencyPath" form
  if (
    creatable &&
    selectedOptions.filter(o => o.value === "LOAD_SELECT_CREATABLE_MODAL")
      .length
  ) {
    loadModal("LOAD_SELECT_CREATABLE_MODAL", {
      ...modalProps,
      updateFormDataInStore
    });
    return;
  }
  onChange(processValue(schema, selectedOptions));
}

function SelectWidget(props) {
  const {
    schema,
    id,
    options,
    value,
    required,
    disabled,
    readonly,
    multiple,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    creatable,
    updateFormDataInStore,
    loadModal,
    modalProps
  } = props;
  const { enumOptions, enumDisabled } = options;
  const emptyValue = multiple ? [] : "";
  const SelectComponent = creatable ? Creatable : Select;

  return (
    <SelectComponent
      id={id}
      multi={multiple}
      options={enumOptions}
      value={typeof value === "undefined" ? emptyValue : value}
      required={required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      onChange={selectedOptions =>
        selectOnChange({
          onChange,
          selectedOptions,
          schema,
          creatable,
          updateFormDataInStore,
          loadModal,
          modalProps
        })
      }
      clearable={true}
    />
  );
}

SelectWidget.defaultProps = {
  autofocus: false
};

if (process.env.NODE_ENV !== "production") {
  SelectWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
  };
}

export default SelectWidget;
