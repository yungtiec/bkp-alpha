import React, { Component, Fragment } from "react";
import autoBind from "react-autobind";
import * as widgets from "../widgets";

export default ({ viewerSchema, formData }) => {
  const Widget = widgets[viewerSchema["viewer:widget"]];

  return (
    <Fragment>
      {viewerSchema.title && <h3>{viewerSchema.title}</h3>}
      {viewerSchema["viewer:widget"] && <Widget formData={formData} />}
    </Fragment>
  );
};
