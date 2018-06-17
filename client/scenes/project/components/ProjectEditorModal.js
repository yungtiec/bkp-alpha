import React from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import { hideModal, updateModalProps } from "../../../data/reducer";
import { ProjectEditorControl } from "./index";
import { addEditor, removeEditor } from "../data/actions";

const ProjectEditorModal = ({
  projectAdmins,
  currentEditors,
  hideModal,
  addEditor,
  removeEditor
}) => (
  <Modal
    isOpen={true}
    onRequestClose={hideModal}
    contentLabel="Edit Comment Modal"
  >
    <ProjectEditorControl
      currentEditors={currentEditors}
      projectAdmins={projectAdmins}
      addEditor={addEditor}
      removeEditor={removeEditor}
      updateModalProps={updateModalProps}
    />
  </Modal>
);

const mapState = (state, ownProps) => ({ ...ownProps });
const actions = { hideModal, updateModalProps, addEditor, removeEditor };

export default connect(mapState, actions)(ProjectEditorModal);
