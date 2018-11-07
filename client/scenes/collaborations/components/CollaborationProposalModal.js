import React, { Component } from "react";
import axios from "axios";
import autoBind from "react-autobind";
import Modal from "react-modal";

export default class CollaborationProposalModal extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  async handleSubmit() {
    try {
      await axios.post("/api/feedback/propose-collaboration", this.state);
      this.props.notify({
        title: "Proposal sent",
        message: "Thank you! We'll contact you shortly.",
        status: "success",
        dismissible: true,
        dismissAfter: 3000
      });
    } catch (err) {
      this.props.notify({
        title: "Something went wrong",
        message: "Please try again later",
        status: "error",
        dismissible: true,
        dismissAfter: 3000
      });
    }
    this.props.hideModal();
  }

  render() {
    return (
      <Modal
        isOpen={true}
        onRequestClose={this.props.hideModal}
        contentLabel="CollaborationProposalModal"
      >
        <div className="container">
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              onChange={this.handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Link to article</label>
            <input
              type="text"
              name="link"
              onChange={this.handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              rows="10"
              name="message"
              onChange={this.handleChange}
              className="form-control"
            />
          </div>

          <button onClick={this.handleSubmit} className="btn btn-primary">
            Submit
          </button>
        </div>
      </Modal>
    );
  }
}
