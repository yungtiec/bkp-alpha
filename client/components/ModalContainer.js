import React from "react";
import { connect } from "react-redux";

/** Modal Components */
import { AnnotationEditModal } from "../scenes/project/scenes/survey/components";

/** Modal Type Constants */
const MODAL_COMPONENTS = {
  ANNOTATION_EDIT_MODAL: AnnotationEditModal
};

const ModalContainer = ({ modalType, modalProps }) => {
  if (!modalType) {
    return null;
  }

  const SpecificModal = MODAL_COMPONENTS[modalType];

  return <SpecificModal {...modalProps} />;
};

export default connect(state => state.data.modal)(ModalContainer);
