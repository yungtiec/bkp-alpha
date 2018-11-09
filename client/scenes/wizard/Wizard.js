import React, { Component } from "react";
import WizardStep from "./components/WizardStep";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import { requiresAuthorization } from "../../components";
import autoBind from "react-autobind";
import Steps, { Step } from "rc-steps";

class Wizard extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
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
    const { wizardStepArray, stepSchemas, stepFormData, match } = this.props;
    const currentStep = Number(
      window.location.pathname.split("/").slice(-1)[0]
    );
    return (
      <div className="main-container">
        <Steps
          className="wizard-steps py-3 mb-5"
          current={currentStep}
          labelPlacement="vertical"
        >
          {wizardStepArray.map((step, i) => (
            <Step
              title={step.title}
              description=""
              status={
                i + 1 === currentStep
                  ? "process"
                  : i + 1 >= currentStep
                    ? "wait"
                    : "finish"
              }
            />
          ))}
        </Steps>
        {wizardStepArray[currentStep] &&
          wizardStepArray[currentStep].id !== "reviewAndSubmit" && (
            <button
              className="btn btn-outline-primary"
              onClick={this.loadPreviewModa}
              style={{ float: "right" }}
            >
              Preview
            </button>
          )}
        <Switch>
          {wizardStepArray.map((step, i) => (
            <Route
              key={`wizard-steps__${i + 1}`}
              path={`${match.path}/step/${i + 1}`}
              render={props => (
                <WizardStep
                  {...step}
                  stepNum={i + 1}
                  numStep={wizardStepArray.length}
                  jsonSchema={stepSchemas[step.id]}
                  formData={stepFormData[step.id]}
                />
              )}
            />
          ))}
          <Redirect to={`${match.path}/step/1`} />
        </Switch>
      </div>
    );
  }
}

export default requiresAuthorization({
  Component: Wizard,
  roleRequired: ["project_editor", "project_admin", "admin", "alpha_user"]
});
