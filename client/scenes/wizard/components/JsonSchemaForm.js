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
      next,
      back
    } = this.props;
    return (
      <div>
        <BootstrapCustomForm
          ref={form => (this.form = form)}
          noHtml5Validate={true}
          schema={schema}
          uiSchema={uiSchema}
          formData={formData}
          onSubmit={next}
          onChange={updateFormDataInStore}
          onError={log("errors")}
        >
          <div>
            <button type="submit">next</button>
            <button type="button" onClick={back}>
              back
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
