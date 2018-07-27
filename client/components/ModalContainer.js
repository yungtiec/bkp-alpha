import React from "react";
import { connect } from "react-redux";

/** Modal Components */
import { EditCommentModal } from "../scenes/project/scenes/survey/components";
import { CommentModal } from "../scenes/project/scenes/survey/components";
import { ProjectEditorModal } from "../scenes/project/components";
import FeedbackModal from "./FeedbackModal";

/** Modal Type Constants */
const MODAL_COMPONENTS = {
  EDIT_COMMENT_MODAL: EditCommentModal,
  COMMENT_MODAL: CommentModal,
  PROJECT_EDITORS_MODAL: ProjectEditorModal,
  FEEDBACK_MODAL: FeedbackModal
};

const styles = {
  FEEDBACK_MODAL: { height: "220px" }
};

const ModalContainer = ({ modalType, modalProps }) => {

  console.log(modalType)

  if (!modalType) {
    return null;
  }
  const SpecificModal = MODAL_COMPONENTS[modalType];

  return <SpecificModal style={styles[modalType]} {...modalProps} />;
};

export default connect(state => state.data.modal)(ModalContainer);
