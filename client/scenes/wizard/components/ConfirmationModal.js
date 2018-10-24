import React, { Fragment } from "react";
import Modal from "react-modal";

export default ({ hideModal, title, message, submit, cancel }) => (
  <Modal
    isOpen={true}
    onRequestClose={hideModal}
    contentLabel="ConfirmationModal"
  >
    <h5>{title}</h5>
    <p>{message}</p>
    <div className="d-flex justify-content-end mt-5">
      {cancel && (
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={cancel.handler}
        >
          {cancel.label}
        </button>
      )}
      {submit && (
        <button
          onClick={() => {
            submit.handler();
            hideModal();
          }}
          className="btn btn-danger ml-2"
        >
          {submit.label}
        </button>
      )}
    </div>
  </Modal>
);
