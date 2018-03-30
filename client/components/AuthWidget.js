import "./AuthWidget.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { logout } from "../data/reducer";
import ReactDOM from "react-dom";

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

  handleClickOutside(evt) {
    if (this.wrapperRef && !this.wrapperRef.contains(evt.target))
      this.setState({
        dropdown: false
      });
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  render() {
    const { isLoggedIn, name, logout, inNavbar } = this.props;
    const className = inNavbar ? "auth-widget--navbar" : "auth-widget";
    const avatarColor = inNavbar ? "#459DF9" : "#ffffff";
    const avatarFgColor = inNavbar ? "#ffffff" : "#09263a";

    if (isLoggedIn)
      return (
        <div className={className} ref={this.setWrapperRef}>
          <div className={`${className}__avatar-container`}>
            <Avatar
              name={name}
              size={46}
              color={avatarColor}
              fgColor={avatarFgColor}
              onClick={this.toggleDropdown}
            />
          </div>
          {this.state.dropdown && (
            <div className={`${className}__dropdown`}>
              <Link
                to="/profile/about"
                style={{ display: "block", margin: "0px" }}
              >
                <div className={`${className}__dropdown-item`}>profile</div>
              </Link>
              <div
                className={`${className}__dropdown-item last`}
                onClick={logout}
              >
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
