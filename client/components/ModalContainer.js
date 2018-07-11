import React from "react";
import { connect } from "react-redux";

/** Modal Components */
import { EditCommentModal } from "../scenes/project/scenes/survey/components";
import { ProjectEditorModal } from "../scenes/project/components";
import { UportModal } from "./AuthForm/UportModal";

/** Modal Type Constants */
const MODAL_COMPONENTS = {
  EDIT_COMMENT_MODAL: EditCommentModal,
  PROJECT_EDITORS_MODAL: ProjectEditorModal,
  UPORT_MODAL: UportModal
};

const ModalContainer = ({ modalType, modalProps }) => {
  if (!modalType) {
    return null;
  }
  const SpecificModal = MODAL_COMPONENTS[modalType];

  return <SpecificModal {...modalProps} />;
};

export default connect(state => state.data.modal)(ModalContainer);
