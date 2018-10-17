import React from "react";
import { connect } from "react-redux";
import { getStepFormData } from "../../data/reducer";
import TextEditorWidget from "./TextEditorWidget";

const DependentTextEditorWidget = props => {

  var { stepFormData, schema, options, ...otherProps } = props;

  if (schema["enum:optionDependencyPath"])
    options.enumOptions = stepFormData[schema["enum:optionDependencyPath"]].map(
      entry => {
        console.log('entry', entry);
        return ({
          value: entry.analysis,
          label: entry[schema["enum:optionDependencyLabelKey"]]
        })
      }
    );

  return <TextEditorWidget {...otherProps} schema={schema} options={options} />;
};

const mapState = (state, ownProps) => {
  return {
    ...ownProps,
    stepFormData: getStepFormData(state)
  };
};

const actions = {};

export default connect(mapState, actions)(DependentTextEditorWidget);
