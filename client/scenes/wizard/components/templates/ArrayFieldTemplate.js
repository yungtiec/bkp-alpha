import React from "react";
import templates from "./index";
import givenTemplates from "@react-schema-form/bootstrap/lib/components/templates";

function ArrayFieldTemplate(props) {
  switch (props.uiSchema["ui:template"]) {
    case "ArrayTable":
      return <templates.ArrayTableFieldTemplate {...props} />;
    default:
      return <givenTemplates.ArrayFieldTemplate {...props} />;
  }
}

export default ArrayFieldTemplate;
