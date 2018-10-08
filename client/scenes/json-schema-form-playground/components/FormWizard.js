import React, { Component } from "react";
import PropTypes from "prop-types";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";
import { steps } from "../../../../json-schema/step-array.json";
import jsonSchema from "../../../../json-schema/step-schemas.json";
import history from "../../../history";
import { Instructions, TokenInformationForm, JsonSchemaForm } from "./index";

const CHILD_COMPONENTS = {
  INSTRUCTIONS: Instructions,
  TOKEN_INFORMATION_FORM: TokenInformationForm,
  JSON_SCHEMA_FORM: JsonSchemaForm
};

class FormWizard extends Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.element
  };

  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidUpdate(prevProps, prevState) {}

  next() {
    // add validation logics here
    if (this.props.match.params.stepNumber <= steps.length)
      history.push(
        this.props.match.path.replace(
          ":stepNumber",
          Number(this.props.match.params.stepNumber) + 1
        )
      );
  }

  back() {
    history.push(
      this.props.match.path.replace(
        ":stepNumber",
        (Number(this.props.match.params.stepNumber) - 1) % steps.length
      )
    );
  }

  render() {
    const { match } = this.props;
    const { id, title, description, childComponentType } = steps[
      this.props.match.params.stepNumber - 1
    ];
    const ChildComponent = CHILD_COMPONENTS[childComponentType];

    return (
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
        <ChildComponent {...jsonSchema[id]} />
        <button onClick={this.back}>back</button>
        <button onClick={this.next}>next</button>
      </div>
    );
  }
}

export default withRouter(FormWizard);
