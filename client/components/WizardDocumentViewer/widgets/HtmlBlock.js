import React, { Component, Fragment } from "react";

// TODO: sanitize
export default ({ formData }) => <div dangerouslySetInnerHTML={{ __html: formData }} />;
