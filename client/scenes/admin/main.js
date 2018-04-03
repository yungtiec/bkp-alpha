import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import autoBind from "react-autobind";
import { fetchPendingAnnotations } from "./data/pendingAnnotations/actions";
import { requiresAuthorization } from "../../components";

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.fetchPendingAnnotations();
  }

  render() {
    const {} = this.props;

    return <div className="">test</div>;
  }
}

const mapState = state => {
  return {};
};

const actions = {
  fetchPendingAnnotations
};

export default withRouter(connect(mapState, actions)(requiresAuthorization(AdminPanel, 'admin')));
