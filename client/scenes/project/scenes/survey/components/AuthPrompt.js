import React, { Component } from "react";
import autoBind from "react-autobind";
import Modal from "react-modal";

const AuthPrompt = ({ showModal, handleCloseModal }) => {
  console.log(showModal)
  return (
    <Modal isOpen={showModal} contentLabel="Minimal Modal Example">
      <button onClick={handleCloseModal}>Close Modal</button>
    </Modal>
  );
};

export default AuthPrompt;
