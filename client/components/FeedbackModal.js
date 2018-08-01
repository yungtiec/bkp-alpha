import React, { Component } from "react";
import Modal from "react-modal";
import { connect } from "react-redux";
import { hideModal } from "../data/reducer";
import autoBind from "react-autobind";
import axios from "axios";

class FeedbackModal extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    autoBind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    if (this.state.value) {
      axios
        .post("/api/feedback", { feedback: this.state.value })
        .then(res => this.props.hideModal());
    }
  }

  render() {
    return (
      <Modal
        isOpen={true}
        onRequestClose={this.props.hideModal}
        contentLabel="Feedback Modal"
      >
        <p>Tell use what you think about the platform.</p>
        <textarea
          className="comment-box__text-area"
          name="textarea"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder="Report bugs and share suggestions for improvements to the platform here"
        />
        <div className="comment-box__actions">
          <button className="btn" onClick={this.handleSubmit}>
            submit
          </button>
          <button className="btn" onClick={this.props.hideModal}>
            cancel
          </button>
        </div>
      </Modal>
    );
  }
}

const mapState = () => ({});

const actions = { hideModal };

export default connect(mapState, actions)(FeedbackModal);
