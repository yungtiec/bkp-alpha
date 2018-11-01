import React, { Component, Fragment } from "react";

/**
 * takes in a title template
 * schema creator can specify variables in template with %VARIABLE_NAME%
 * %VARIABLE_NAME% will be replaced by real value after render
 * for example, given the input:
 * {
 *    title: 'transparency score: %transparencyScore%',
 *    data: {transparencyScore: 8}
 * }
 * The output is going to be 'transparency score: 8'
 */

export default ({ title, formData }) => (
  <h5>
    {keys(formData).reduce(
      key => title.replace(`%${key}%`, formData[key]),
      title
    )}
  </h5>
);
