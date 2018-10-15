import React, { Fragment } from "react";
import { templates } from "@react-schema-form/bootstrap";

function TableInputItemFieldTemplate(props) {
  return <Fragment>{props.properties.map(prop => prop.content)}</Fragment>;
}

/**
 * TODO: PropTypes
 */

export default TableInputItemFieldTemplate;
