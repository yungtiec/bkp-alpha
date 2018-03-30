import React, { Component } from "react";
import { ProfileNavbar } from "./index";

class ProfileWithNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <ProfileNavbar />
        {this.props.children}
      </div>
    );
  }
}

export default ProfileWithNav;
