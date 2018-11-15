import React, { Component, Fragment } from "react";
import sanitizeHtml from "sanitize-html";
// TODO: sanitize
export default ({ formData }) => (
  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(formData) }} />
);
