import React, { Fragment } from "react";

function TableRowFieldTemplate(props) {
  return <Fragment>{props.properties.map(prop => prop.content)}</Fragment>;
}

/**
 * TODO: PropTypes
 */

export default TableRowFieldTemplate;
