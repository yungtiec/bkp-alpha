import React, { Component } from "react";
import { steps } from "../../../json-schema/step-array.json";
import FormWizard from "./components/FormWizard";
import { withRouter, Switch, Route, Link, Redirect } from "react-router-dom";

const Wizard = ({ match }) => (
  <Switch>
    {steps.map((step, i) => (
      <Route
        key={`wizard-steps__${i + 1}`}
        path={`${match.path}/step/:stepNumber`}
        render={props => <FormWizard {...step} />}
      />
    ))}
    <Redirect to={`${match.path}/step/1`} />
  </Switch>
);

export default withRouter(Wizard);
