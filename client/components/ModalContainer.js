import React from "react";
import { connect } from "react-redux";

/** Modal Components */
import CollaborationProposalModal from "../scenes/collaborations/components/CollaborationProposalModal";
import { EditCommentModal } from "../scenes/document/scenes/Version/components";
import { ProjectEditorModal } from "../scenes/project/components";
import FeedbackModal from "./FeedbackModal";

/** Modal Type Constants **/
const MODAL_COMPONENTS = {
  COLLABORATION_PROPOSAL_MODAL: CollaborationProposalModal,
  EDIT_COMMENT_MODAL: EditCommentModal,
  PROJECT_EDITORS_MODAL: ProjectEditorModal,
  FEEDBACK_MODAL: FeedbackModal
};

const styles = {
  FEEDBACK_MODAL: { height: "220px" }
};

const ModalContainer = ({ modalType, modalProps }) => {
  if (!modalType) {
    return null;
  }

  console.log(modalType);
  const SpecificModal = MODAL_COMPONENTS[modalType];

  return <SpecificModal style={styles[modalType]} {...modalProps} />;
};

export default connect(state => state.data.modal)(ModalContainer);
