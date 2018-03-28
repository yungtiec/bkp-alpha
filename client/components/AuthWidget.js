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

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  toggleDropdown() {
    const { dropdown } = this.state;
    this.setState({
      dropdown: !dropdown
    });
  }

  handleClickOutside() {
    this.setState({
      dropdown: false
    });
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  render() {
    const { isLoggedIn, name, logout } = this.props;
    if (isLoggedIn)
      return (
        <div className="auth-widget" ref={this.setWrapperRef}>
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
              <div className="auth-widget__dropdown-item">
                profile
              </div>
              <div className="auth-widget__dropdown-item" onClick={logout}>
                logout
              </div>
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
