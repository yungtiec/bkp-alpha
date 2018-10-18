import React, { Component } from "react";
import PropTypes from "prop-types";
import autoBind from "react-autobind";
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

class JsonSchemaForm extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const {
      schema,
      uiSchema,
      formData,
      formDataPath,
      id,
      updateFormDataInStore,
      submit,
      cancel,
      onChange
    } = this.props;

    const handleChange = onChange || updateFormDataInStore;

    return (
      <div>
        <BootstrapCustomForm
          ref={form => (this.form = form)}
          noHtml5Validate={true}
          schema={schema}
          uiSchema={uiSchema}
          formData={formData}
          onSubmit={submit.handler}
          onChange={handleChange}
          onError={log("errors")}
        >
          <div className="d-flex justify-content-end mt-5">
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={cancel.handler}
            >
              {cancel.label}
            </button>
            <button type="submit" className="btn btn-primary ml-2">
              {submit.label}
            </button>
          </div>
        </BootstrapCustomForm>
      </div>
    );
  }
}

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
