import React, { Component } from "react";
import { steps } from "../../../json-schema/step-array.json";
import WizardStep from "./components/WizardStep";
import { withRouter, Switch, Route, Link, Redirect } from "react-router-dom";
import { fetchStepArrayAndSchemas } from "./data/actions";
import { getStepArrayAndSchemas } from "./data/reducer";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import Steps, { Step } from "rc-steps";

class Wizard extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.fetchStepArrayAndSchemas();
  }

  render() {
    const { stepArray, stepSchemas, stepFormData, match } = this.props;
    const currentStep = Number(
      window.location.pathname.split("/").slice(-1)[0]
    );
    if (!stepSchemas || !stepSchemas) return null;
    return (
      <div className="main-container">
        <Steps current={currentStep} labelPlacement="vertical">
          {stepArray.map((step, i) => (
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
        <Switch>
          {stepArray.map((step, i) => (
            <Route
              key={`wizard-steps__${i + 1}`}
              path={`${match.path}/step/${i + 1}`}
              render={props => (
                <WizardStep
                  {...step}
                  stepNum={i + 1}
                  numStep={stepArray.length}
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

const mapState = state => {
  const { stepArray, stepSchemas, stepFormData } = getStepArrayAndSchemas(
    state
  );
  return {
    stepArray,
    stepSchemas,
    stepFormData
  };
};

const actions = { fetchStepArrayAndSchemas };

export default withRouter(
  connect(
    mapState,
    actions
  )(Wizard)
);
