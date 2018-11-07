import React, { Fragment } from "react";
import Modal from "react-modal";
import { WizardDocumentViewer } from "../../../components";
import { connect } from "react-redux";
import { getStepArrayAndSchemas } from "../data/reducer";

const WizardDocumentFinalReview = ({
  viewerStepArray,
  stepSchemas,
  stepFormData
}) => (
  <WizardDocumentViewer
    stepFormData={stepFormData}
    viewerStepArray={viewerStepArray}
    stepSchemas={stepSchemas}
  />
);

const mapStates = (state, ownProps) => {
  const { viewerStepArray, stepSchemas, stepFormData } = getStepArrayAndSchemas(
    state
  );
  return {
    ...ownProps,
    viewerStepArray,
    stepSchemas,
    stepFormData
  };
};

const actions = {};

export default connect(
  mapStates,
  actions
)(WizardDocumentFinalReview);
