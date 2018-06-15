import "./CollaboratorControl.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";

class CollaboratorControl extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      email: "",
      pristine: true,
      validEmail: true
    };
  }

  handleEmailChange(event) {
    var newState = { email: event.target.value };
    if (!this.state.pristine && this.validateEmail()) {
      newState.validEmail = true;
    } else if (!this.state.pristine && !this.validateEmail()) {
      newState.validEmail = false;
    }
    this.setState(newState);
  }

  handleSubmit(event) {
    if (this.validateEmail()) {
      this.props.addNewCollaborator(this.state.email);
      this.setState({
        email: "",
        pristine: true,
        validEmail: true
      });
    } else {
      this.setState({
        pristine: false,
        validEmail: false
      });
    }
    event && event.preventDefault();
  }

  handleKeyPress(event) {
    if (event.key == "Enter") {
      event.preventDefault();
      this.handleSubmit();
    }
  }

  validateEmail() {
    if (!this.state.email.length) return;
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
    return reg.test(this.state.email);
  }

  render() {
    const { creator, collaboratorEmails, removeCollaborator } = this.props;
    const isEnabled = this.state.email.length > 0;

    return (
      <div>
        <div className="social-sidebar__collaborator-input input-group">
          <input
            type="email"
            className="form-control"
            placeholder="Collaborator's email"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            value={this.state.email}
            onChange={this.handleEmailChange}
            onKeyPress={this.handleKeyPress}
          />
          <div className="input-group-append">
            <button
              className="input-group-text btn-secondary"
              onClick={this.handleSubmit}
              disabled={!isEnabled}
            >
              Add
            </button>
          </div>
        </div>
        {!this.state.pristine && !this.state.validEmail ? (
          <p className="mt-1 text-danger">valid email required</p>
        ) : null}
        <div className="mt-3">
          <div className="collaborator-item d-flex justify-content-between">
            <div className="collaborator-info d-flex">
              <p className="collaborator-email mb-1">{creator.email}</p>
              <p className="ml-3 collaborator-type mb-1">owner</p>
            </div>
            <div />
          </div>
          {collaboratorEmails.map((email, i) => (
            <div
              className="collaborator-item d-flex justify-content-between"
              key={`collaborator-item__${i}`}
            >
              <div className="collaborator-info d-flex">
                <p className="collaborator-email">{email}</p>
                <p className="ml-3 collaborator-type">collaborator</p>
              </div>
              <div className="collaborator-actions">
                <span
                  className="px-2 py-1"
                  onClick={() => removeCollaborator(email)}
                >
                  <i class="fas fa-times text-danger" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default CollaboratorControl;
