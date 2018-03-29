import React, { Component } from "react";
import Navbar from "./index";

class LayoutWithNav extends Component {
  render() {
    return (
      <div>
        <Navbar />
        {this.props.children}
      </div>
    );
  }
}

export default LayoutWithNav;
