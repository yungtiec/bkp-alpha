import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Switch, Route, Link, Redirect } from "react-router-dom";
import {
  fetchStepArrayAndSchemas,
  fetchDocumentAndSchemasBySlug,
  createDocumentWithSchemaId
} from "./data/actions";
import { getStepArrayAndSchemas } from "./data/reducer";
import { loadModal, hideModal } from "../../data/reducer";
import { requiresAuthorization } from "../../components";
import autoBind from "react-autobind";
import Steps, { Step } from "rc-steps";
import { matchPath } from "react-router";
import Wizard from "./Wizard";

class QueryWizard extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    // hardcode wizardSchemaId for now
    if (this.props.match.params.slug === "-") {
      this.props.createDocumentWithSchemaId(1);
    } else {
      this.props.fetchDocumentAndSchemasBySlug(this.props.match.params.slug);
    }
  }

  loadPreviewModa() {
    this.props.loadModal("WIZARD_DOCUMENT_PREVIEW_MODAL", {
      hideModal: this.props.hideModal,
      viewerStepArray: this.props.viewerStepArray,
      stepSchemas: this.props.stepSchemas,
      stepFormData: this.props.stepFormData
    });
  }

  render() {
    const {
      wizardStepArray,
      stepSchemas,
      stepFormData,
      match,
      isLoggedIn
    } = this.props;
    const currentStep = Number(
      window.location.pathname.split("/").slice(-1)[0]
    );
    if (!stepSchemas || !stepSchemas || !isLoggedIn) return null;
    return <Wizard {...this.props} />;
  }
}

const mapState = state => {
  const {
    stepArray,
    viewerStepArray,
    wizardStepArray,
    stepSchemas,
    stepFormData,
    document,
    version
  } = getStepArrayAndSchemas(state);

  return {
    stepArray,
    viewerStepArray,
    wizardStepArray,
    stepSchemas,
    stepFormData,
    document,
    version,
    isLoggedIn: !!state.data.user.id
  };
};

const actions = {
  fetchStepArrayAndSchemas,
  fetchDocumentAndSchemasBySlug,
  createDocumentWithSchemaId,
  loadModal,
  hideModal
};

export default withRouter(
  connect(
    mapState,
    actions
  )(QueryWizard)
);
