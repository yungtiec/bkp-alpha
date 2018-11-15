import React from "react";
import PropTypes from "prop-types";

import { REQUIRED_FIELD_SYMBOL } from "./FieldTemplate";

function TitleTemplate(props) {
  const { id, title, required } = props;
  const legend = required ? title + REQUIRED_FIELD_SYMBOL : title;
  return (
    <label className="col-form-label" id={id}>
      {legend}
      {required && <span class="required">*</span>}
    </label>
  );
}

if (process.env.NODE_ENV !== "production") {
  TitleTemplate.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool
  };
}

export default TitleTemplate;
