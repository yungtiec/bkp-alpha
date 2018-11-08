import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Switch, Route, Link, Redirect } from "react-router-dom";
import { fetchStepArrayAndSchemas } from "./data/actions";
import { getStepArrayAndSchemas } from "./data/reducer";
import { loadModal, hideModal } from "../../data/reducer";
import { requiresAuthorization } from "../../components";
import autoBind from "react-autobind";
import Wizard from "./Wizard";

class QueryWizard extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    // hardcode wizardSchemaId for now
    this.props.fetchStepArrayAndSchemas(1);
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
    viewerStepArray,
    wizardStepArray,
    stepSchemas,
    stepFormData
  } = getStepArrayAndSchemas(state);
  return {
    viewerStepArray,
    wizardStepArray,
    stepSchemas,
    stepFormData,
    isLoggedIn: !!state.data.user.id
  };
};

const actions = { fetchStepArrayAndSchemas, loadModal, hideModal };

export default withRouter(
  connect(
    mapState,
    actions
  )(QueryWizard)
);
