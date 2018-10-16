import React, { Component } from "react";
import { connect } from "react-redux";
import { updateFormDataInStore } from "../data/actions";
import { assignIn } from "lodash";
import { withTheme, Form } from "@react-schema-form/core";
import templates from "./templates";
import widgets from "./widgets";

const BootstrapCustomForm = withTheme("Bootstrap", { widgets, templates })(
  Form
);

const log = type => console.log.bind(console, type);

const JsonSchemaForm = ({
  schema,
  uiSchema,
  formData,
  formDataPath,
  id,
  updateFormDataInStore,
  next,
  back
}) => {
  return (
    <div>
      <BootstrapCustomForm
        noHtml5Validate={true}
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        onChange={updateFormDataInStore}
        onSubmit={props => next()}
        onError={log("errors")}
      >
        <div>
          <button type="submit">Submit</button>
          <button type="button" onClick={back}>Cancel</button>
        </div>
      </BootstrapCustomForm>
    </div>
  );
};

const mapState = (state, ownProps) => ({ ...ownProps });

const mapDispatch = (dispatch, ownProps) => ({
  updateFormDataInStore: props =>
    dispatch(
      updateFormDataInStore(
        ownProps.formDataPath || ownProps.id,
        props.formData
      )
    )
});

export default connect(
  mapState,
  mapDispatch
)(JsonSchemaForm);
