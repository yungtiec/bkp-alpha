/*eslint no-unused-vars: off*/
import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

function MarkdownRenderWidget(props) {
  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  if (!props.id) {
    /*eslint-disable-next-line*/
    console.log("No id for", props);
    throw new Error(`no id for props ${JSON.stringify(props)}`);
  }
  const {
    value,
    options,
    schema,
    formContext,
    registry,
    ...inputProps
  } = props;

  return (
    <ReactMarkdown
      className="markdown-body"
      source={value == null ? "" : value}
    />
  );
}

MarkdownRenderWidget.defaultProps = {
  type: "text",
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false
};

if (process.env.NODE_ENV !== "production") {
  MarkdownRenderWidget.propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
  };
}

export default MarkdownRenderWidget;

// merge
