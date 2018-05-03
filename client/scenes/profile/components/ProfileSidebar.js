import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import CheckboxTree from "react-checkbox-tree";

export default class ProfileSidebar extends Component {
  constructor() {
    super();

    this.state = {
      expanded: ["status"]
    };
  }

  render() {

    return (
      <CheckboxTree
        nodes={this.props.nodes}
        onlyLeafCheckboxes={true}
        checked={this.props.checked}
        expanded={this.state.expanded}
        onCheck={checked => this.props.checkSidebarFilter(checked)}
        onExpand={expanded => this.setState({ expanded })}
      />
    );
  }
}
