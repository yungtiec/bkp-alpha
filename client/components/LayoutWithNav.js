import React, { Component } from "react";
import { Navbar } from "./index";

class LayoutWithNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('???')

    return (
      <div>
        <Navbar />
        {this.props.children}
      </div>
    );
  }
}

export default LayoutWithNav;
