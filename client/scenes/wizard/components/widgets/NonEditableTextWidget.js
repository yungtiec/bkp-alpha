/*eslint no-unused-vars: off*/
import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

function NonEditableTextWidget(props) {
  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  if (!props.id) {
    /*eslint-disable-next-line*/
    console.log("No id for", props);
    throw new Error(`no id for props ${JSON.stringify(props)}`);
  }
  const { value, options, schema, formContext, registry } = props;

  return <h6>{value == null ? "" : value}</h6>;
}

NonEditableTextWidget.defaultProps = {
  type: "text"
};

if (process.env.NODE_ENV !== "production") {
  NonEditableTextWidget.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.any
  };
}

export default NonEditableTextWidget;

// merge
