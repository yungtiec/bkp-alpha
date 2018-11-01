import React, { Component, Fragment } from "react";
import autoBind from "react-autobind";
import * as widgets from "../widgets";
import { keys, isObject, isArray } from "lodash";

const traverse = (formData, viewerSchema) => {
  var Widget;
  if (isObject(formData) && !isArray(formData)) {
    return keys(viewerSchema).map(key => {
      return traverse(formData[key], viewerSchema[key]);
    });
  } else {
    Widget = widgets[viewerSchema["viewer:widget"]];
    console.log(viewerSchema, formData);
    return Widget ? (
      <Widget {...viewerSchema} formData={formData} />
    ) : (
      <p>{formData}</p>
    );
  }
};

export default ({ jsonSchema, formData }) => {
  const viewerSchema = jsonSchema.viewerSchema;
  const Widget = widgets[viewerSchema["viewer:widget"]];

  return (
    <Fragment>
      {viewerSchema.title && <h3>{viewerSchema.title}</h3>}
      {isObject(formData) ? (
        traverse(formData, viewerSchema)
      ) : viewerSchema["viewer:widget"] ? (
        <Widget formData={formData} />
      ) : (
        <p>{formData}</p>
      )}
    </Fragment>
  );
};
