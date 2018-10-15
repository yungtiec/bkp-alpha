import React from "react";
import { connect } from "react-redux";
import { getStepFormData } from "../../data/reducer";
import SelectWidget from "./SelectWidget";

const DependentSelectWidget = props => {

  var { stepFormData, schema, options, ...otherProps } = props;

  if (schema["enum:optionDependencyPath"])
    options.enumOptions = stepFormData[schema["enum:optionDependencyPath"]].map(
      entry => ({
        value: entry,
        label: entry[schema["enum:optionDependencyLabelKey"]]
      })
    );

  return <SelectWidget {...otherProps} schema={schema} options={options} />;
};

const mapState = (state, ownProps) => {
  return {
    ...ownProps,
    stepFormData: getStepFormData(state)
  };
};

const actions = {};

export default connect(mapState, actions)(DependentSelectWidget);
