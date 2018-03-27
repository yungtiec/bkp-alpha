import "./AuthWidget.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import Avatar from "react-avatar";
import { logout } from "../data/reducer";

class AuthWidget extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      dropdown: false
    };
  }

  toggleDropdown() {
    const { dropdown } = this.state;
    this.setState({
      dropdown: !dropdown
    });
  }

  render() {
    const { isLoggedIn, name } = this.props;
    if (isLoggedIn)
      return (
        <div className="auth-widget">
          <div className="auth-widget__avatar-container">
            <Avatar
              name={name}
              size={46}
              color="#ffffff"
              fgColor="#09263a"
              onClick={this.toggleDropdown}
            />
          </div>
          {this.state.dropdown && (
            <div className="auth-widget__dropdown">
              <div className="auth-widget__dropdown-item">logout</div>
            </div>
          )}
        </div>
      );
    else return <div />;
  }
}

const mapState = state => {
  const isLoggedIn = !!state.data.user.id;
  const name = isLoggedIn
    ? `${state.data.user.first_name} ${state.data.user.last_name}`
    : "";
  return {
    isLoggedIn,
    name
  };
};

const actions = {
  logout
};

export default connect(mapState, actions)(AuthWidget);
