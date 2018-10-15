import React from "react";
import { templates } from "@react-schema-form/bootstrap";
import { TableInputFieldTemplate, FragmentedFieldTemplate } from "./index";

function FieldTemplate(props) {
  switch (props.uiSchema["ui:template"]) {
    case "TableInputField":
      return <TableInputFieldTemplate {...props} />;
    case "TableInputItemField":
      return <FragmentedFieldTemplate {...props} />;
    default:
      return <FragmentedFieldTemplate {...props} />;
  }
}

export default FieldTemplate;
