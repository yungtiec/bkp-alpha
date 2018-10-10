import React from "react";
import { templates } from "@react-schema-form/bootstrap";
import TableInputItemFieldTemplate from "./TableInputItemFieldTemplate";
import AccordionFieldTemplate from "./AccordionFieldTemplate";

function ObjectFieldTemplate(props) {
  switch (props.uiSchema["ui:template"]) {
    case "TableInputItemField":
      return <TableInputItemFieldTemplate {...props} />;
    case "AccordionField":
      return <AccordionFieldTemplate {...props} />;
    default:
      return <templates.ObjectFieldTemplate {...props} />;
  }
}

export default ObjectFieldTemplate;
