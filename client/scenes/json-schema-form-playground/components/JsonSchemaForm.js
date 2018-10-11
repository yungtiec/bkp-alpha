import React, { Component } from "react";
import { render } from "react-dom";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import TableArrayFieldTemplate from "./TableArrayFieldTemplate";
import FieldTemplate from "./FieldTemplate";
import SelectWidget from "./SelectWidget";
import MarkdownRenderWidget from "./MarkdownRenderWidget";
import NonEditableTextWidget from "./NonEditableTextWidget";

import { withTheme, Form } from "@react-schema-form/core";
import templates from "@react-schema-form/bootstrap/lib/components/templates";
import widgets from "@react-schema-form/bootstrap/lib/components/widgets";

templates.ObjectFieldTemplate = ObjectFieldTemplate;
templates.FieldTemplate = FieldTemplate;
templates.ArrayFieldTemplate = TableArrayFieldTemplate;

widgets.SelectWidget = SelectWidget;
widgets.MarkdownRenderWidget = MarkdownRenderWidget;
widgets.NonEditableTextWidget = NonEditableTextWidget;

const BootstrapCustomForm = withTheme("Bootstrap", { widgets, templates })(
  Form
);

const log = type => console.log.bind(console, type);

export default ({ schema, uiSchema, defaultFormData }) => {
  return (
    <div>
      <BootstrapCustomForm
        noHtml5Validate={true}
        schema={schema}
        uiSchema={uiSchema}
        formData={defaultFormData}
        onChange={log("changed")}
        onSubmit={log("submitted")}
        onError={log("errors")}
      />
    </div>
  );
};
