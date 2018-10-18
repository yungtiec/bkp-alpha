import React from "react";
import { connect } from "react-redux";

/** Modal Components */
import { EditCommentModal } from "../scenes/document/scenes/Version/components";
import { CommentModal } from "../scenes/document/scenes/Version/components";
import { ProjectEditorModal } from "../scenes/project/components";
import FeedbackModal from "./FeedbackModal";
import DependentSelectWidgetCreateModal from "../scenes/wizard/components/widgets/DependentSelectWidgetCreateModal";

/** Modal Type Constants */
const MODAL_COMPONENTS = {
  EDIT_COMMENT_MODAL: EditCommentModal,
  COMMENT_MODAL: CommentModal,
  PROJECT_EDITORS_MODAL: ProjectEditorModal,
  FEEDBACK_MODAL: FeedbackModal,
  LOAD_SELECT_CREATABLE_MODAL: DependentSelectWidgetCreateModal
};

const styles = {
  FEEDBACK_MODAL: { height: "220px" }
};

const ModalContainer = ({ modalType, modalProps }) => {
  if (!modalType) {
    return null;
  }
  const SpecificModal = MODAL_COMPONENTS[modalType];

  return <SpecificModal style={styles[modalType]} {...modalProps} />;
};

export default connect(state => state.data.modal)(ModalContainer);
