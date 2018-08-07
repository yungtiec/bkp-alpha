import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import CheckboxTree from "react-checkbox-tree";
import { checkSidebarFilter } from "../reducer";

const nodes = [
  {
    value: "status",
    label: "STATUS",
    children: [
      { value: "verified", label: "Verified" },
      { value: "spam", label: "Spam" },
      { value: "pending", label: "Pending" }
    ]
  },
  {
    value: "issue",
    label: "ISSUE",
    children: [
      { value: "open", label: "Open" },
      { value: "closed", label: "Closed" }
    ]
  }
];

class AdminProjectSurveySidebar extends Component {
  constructor() {
    super();

    this.state = {
      expanded: ["status", "issue"]
    };
  }

  render() {
    return (
      <CheckboxTree
        nodes={nodes}
        onlyLeafCheckboxes={true}
        checked={this.props.checked}
        expanded={this.state.expanded}
        onCheck={this.props.checkSidebarFilter}
        onExpand={expanded => this.setState({ expanded })}
      />
    );
  }
}

const mapState = state => ({checked: state.scenes.admin.scenes.projectSurvey.checked})

const actions = {
  checkSidebarFilter
}

export default connect(mapState, actions)(AdminProjectSurveySidebar)
