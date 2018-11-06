import React, { Component, Fragment } from "react";
import autoBind from "react-autobind";
import PropTypes from "prop-types";
import {
  JsonSchemaFormDataTemplate,
  JsonSchemaAccordionDataTemplate,
  TextBlockTemplate
} from "./templates";

const templates = {
  JSON_SCHEMA_FORM_DATA_TEMPLATE: JsonSchemaFormDataTemplate,
  JSON_SCHEMA_ACCORDION_DATA_TEMPLATE: JsonSchemaAccordionDataTemplate,
  TEXT_BLOCK_TEMPLATE: TextBlockTemplate
};

export default class WizardDocumentViewer extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { stepFormData, viewerStepArray, stepSchemas } = this.props;

    return (
      <div className="markdown-body">
        {viewerStepArray.map((s, i) => {
          var ChildComponent = templates[s.template];
          return ChildComponent ? (
            <ChildComponent
              {...s}
              jsonSchemas={stepSchemas[s.id]}
              formData={stepFormData[s.id]}
            />
          ) : (
            ""
          );
        })}
      </div>
    );
  }
}

if (process.env.NODE_ENV !== "production") {
  WizardDocumentViewer.propTypes = {
    stepFormData: PropTypes.object,
    viewerStepArray: PropTypes.array,
    stepSchemas: PropTypes.object
  };
}
