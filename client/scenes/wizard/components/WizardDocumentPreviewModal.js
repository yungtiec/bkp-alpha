import "./WizardDocumentPreviewModal.scss";
import React, { Fragment } from "react";
import Modal from "react-modal";
import { WizardDocumentViewer } from "../../../components";

const WizardDocumentPreviewModal = ({
  stepArray,
  stepSchemas,
  stepFormData,
  hideModal
}) => (
  <Modal
    isOpen={true}
    onRequestClose={hideModal}
    contentLabel="WizardDocumentPreviewModal"
    className="wizard__preview-modal"
  >
    <WizardDocumentViewer
      stepFormData={stepFormData}
      stepArray={stepArray}
      stepSchemas={stepSchemas}
    />
  </Modal>
);

export default WizardDocumentPreviewModal;
