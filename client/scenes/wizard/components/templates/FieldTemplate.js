import React from "react";
import templates from "./index";

function FieldTemplate(props) {
  switch (props.uiSchema["ui:template"]) {
    case "TableTh":
      return <templates.TableThFieldTemplate {...props} />;
    case "TableRow":
      return <templates.FragmentedFieldTemplate {...props} />;
    default:
      return <templates.FragmentedFieldTemplate {...props} />;
  }
}

export default FieldTemplate;
