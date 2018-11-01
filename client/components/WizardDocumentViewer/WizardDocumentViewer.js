import React, { Component, Fragment } from "react";
import autoBind from "react-autobind";
import PropTypes from "prop-types";
import {
  JsonSchemaFormDataTemplate,
  JsonSchemaAccordionDataTemplate
} from "./templates";

export default class WizardDocumentViewer extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { stepFormData, stepArray, stepSchemas } = this.props;

    return (
      <div className="markdown-body">
        {stepArray.map((s, i) => {
          var localSchema = stepSchemas[s.id];
          var localFormData = stepFormData[s.id];
          switch (s.childComponentType) {
            case "TOKEN_INFORMATION_FORM":
              return "";
            case "JSON_SCHEMA_FORM":
              return (
                <JsonSchemaFormDataTemplate
                  jsonSchema={stepSchemas[s.id]}
                  formData={stepFormData[s.id]}
                />
              );
            case "JSON_SCHEMA_FORMS_ACCORDION":
              return (
                <JsonSchemaAccordionDataTemplate
                  jsonSchemas={stepSchemas[s.id]}
                  formData={stepFormData[s.id]}
                />
              );
            default:
              return "";
          }
        })}
      </div>
    );
  }
}

if (process.env.NODE_ENV !== "production") {
  WizardDocumentViewer.propTypes = {
    stepFormData: PropTypes.object,
    stepArray: PropTypes.array,
    stepSchemas: PropTypes.object
  };
}
