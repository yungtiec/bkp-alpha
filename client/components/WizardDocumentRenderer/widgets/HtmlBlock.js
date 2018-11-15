import React, { Component, Fragment } from "react";

// TODO: sanitize
export default ({ html }) => <div dangerouslySetInnerHTML={{ __html: html }} />;
