import React, { Component, Fragment } from "react";
import * as widgets from "../widgets";
import JsonSchemaFormDataTemplate from "./JsonSchemaFormDataTemplate";
import { keys } from "lodash";

export default ({ jsonSchemas, formData }) => {
  var { accordionOrder, ...accordionItemDict } = jsonSchemas;
  return accordionOrder.map(key => {
    var { title, viewerSchema } = accordionItemDict[key].viewerSchema;
    return (
      <JsonSchemaFormDataTemplate
        jsonSchemas={accordionItemDict[key]}
        formData={formData[key]}
      />
    );
  });
};
