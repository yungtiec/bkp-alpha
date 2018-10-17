import React from "react";
import { connect } from "react-redux";
import { getStepFormData } from "../../data/reducer";
import TextEditorWidget from "./TextEditorWidget";

const DependentTextEditorWidget = props => {
  return <TextEditorWidget {...props} />;
};

const mapState = (state, ownProps) => {
  return {
    ...ownProps,
    stepFormData: getStepFormData(state)
  };
};

const actions = {};

export default connect(mapState, actions)(DependentTextEditorWidget);
