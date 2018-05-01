import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import CheckboxTree from "react-checkbox-tree";
import './react-checkbox-tree.scss';

const nodes = [
  {
    value: "types",
    label: "TYPES",
    children: [
      { value: "all", label: "All" },
      { value: "annotations", label: "Annotations" },
      { value: "comment", label: "Comment" }
    ]
  },{
    value: "status",
    label: "STATUS",
    children: [
      { value: "verified", label: "Verified" },
      { value: "spam", label: "Spam" },
      { value: "pending", label: "Pending" }
    ]
  },{
    value: "issue",
    label: "ISSUE",
    children: [
      { value: "open", label: "Open" },
      { value: "closed", label: "Closed" }
    ]
  }
];

export default class AdminProjectSurveySidebar extends Component {
  constructor() {
    super();

    this.state = {
      checked: [],
      expanded: []
    };
  }

  render() {
    return (
      <CheckboxTree
        nodes={nodes}
        onlyLeafCheckboxes={true}
        checked={this.state.checked}
        expanded={this.state.expanded}
        onCheck={checked => this.setState({ checked })}
        onExpand={expanded => this.setState({ expanded })}
      />
    );
  }
}
