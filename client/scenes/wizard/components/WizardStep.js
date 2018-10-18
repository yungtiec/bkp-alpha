import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";
import { steps } from "../../../../json-schema/step-array.json";
import jsonSchema from "../../../../json-schema/step-schemas.json";
import history from "../../../history";
import {
  Instructions,
  TokenInformationForm,
  JsonSchemaForm,
  JsonSchemaFormsAccordion
} from "./index";

const CHILD_COMPONENTS = {
  INSTRUCTIONS: Instructions,
  TOKEN_INFORMATION_FORM: TokenInformationForm,
  JSON_SCHEMA_FORM: JsonSchemaForm,
  JSON_SCHEMA_FORMS_ACCORDION: JsonSchemaFormsAccordion
};

class WizardStep extends Component {
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
    if (this.props.stepNum <= this.props.numStep)
      history.push(`/wizard/step/${this.props.stepNum + 1}`);
  }

  back() {
    if (this.props.stepNum > 1)
      history.push(`/wizard/step/${this.props.stepNum - 1}`);
  }

  render() {
    const {
      id,
      title,
      description,
      childComponentType,
      content,
      jsonSchema,
      formData,
      match,
      stepNum,
      numStep
    } = this.props;

    const ChildComponent = CHILD_COMPONENTS[childComponentType];

    return (
      <Fragment>
        <h5>{title}</h5>
        <p>{description}</p>
        <ChildComponent
          key={id}
          {...jsonSchema}
          id={id}
          content={content}
          formData={formData}
          submit={{ label: "next", handler: this.next }}
          cancel={{ label: "back", handler: this.back }}
          isNotStep={false}
        />
      </Fragment>
    );
  }
}

export default withRouter(WizardStep);

// {stepNum !== 1 && <button onClick={this.back}>back</button>}
// {stepNum !== numStep && <button onClick={this.next}>next</button>}
// {stepNum === numStep && <button>submit</button>}
