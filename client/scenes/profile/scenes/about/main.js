import "./index.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";

class ProfileAbout extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      edit: this.props.location.state && this.props.location.state.edit,
      firstName: this.props.first_name,
      lastName: this.props.last_name,
      organization: this.props.organization
    };
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleSubmit(evt) {
    this.props.editProfile({ ...this.state, id: this.props.id });
    this.setState(prevState => ({
      edit: !prevState.edit
    }));
  }

  render() {
    return (
      <div className="profile-subroute container">
        {this.props.restricted_access && (
          <div className="profile-about__restricted-access">
            <span className="badge badge-danger">Restricted Access</span>
            <p>
              Due to your recent activities, admin has revoke your comment
              privilege.
            </p>
          </div>
        )}
        {(!this.props.first_name || !this.props.last_name) && (
          <div className="profile-about__restricted-access">
            <p className="text-center mt-3 text-danger">
              Please update your information.
            </p>
          </div>
        )}
        <div className="profile-about__field">
          <span className="profile-about__field-label">Email</span>
          <div className="profile-about__field-value">
            <div className="profile-about__input-container">
              <input
                type="text"
                disabled
                name="email"
                value={this.props.email || ""}
              />
            </div>
          </div>
        </div>
        <div className="profile-about__field">
          <span className="profile-about__field-label">First Name</span>
          <div className="profile-about__field-value">
            <div className="profile-about__input-container">
              <input
                ref={input => (this.firstInput = input)}
                type="text"
                disabled={!this.state.edit}
                onChange={this.handleChange}
                name="firstName"
                value={this.state.firstName || ""}
              />
            </div>
          </div>
        </div>
        <div className="profile-about__field">
          <span className="profile-about__field-label">Last Name</span>
          <div className="profile-about__field-value">
            <div className="profile-about__input-container">
              <input
                type="text"
                disabled={!this.state.edit}
                onChange={this.handleChange}
                name="lastName"
                value={this.state.lastName}
              />
            </div>
          </div>
        </div>

        <div className="profile-about__field">
          <span className="profile-about__field-label">Organization</span>
          <div className="profile-about__field-value">
            <div className="profile-about__input-container">
              <input
                type="text"
                disabled={!this.state.edit}
                onChange={this.handleChange}
                name="organization"
                value={this.state.organization || ""}
              />
            </div>
          </div>
        </div>
        {this.props.isMyProfile ? (
          <div className="profile-about__field justify-content-center">
            {this.state.edit ? (
              <button
                type="button"
                className="btn btn-primary  mt-4 btn-lg"
                onClick={this.handleSubmit}
              >
                save changes
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary  mt-4 btn-lg"
                onClick={() => {
                  this.firstInput.focus();
                  this.setState(prevState => ({
                    edit: !prevState.edit
                  }));
                }}
              >
                edit
              </button>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(ProfileAbout);
