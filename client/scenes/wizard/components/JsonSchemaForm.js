import "./JsonSchemaForm.scss";
import React, { Component } from "react";
import PropTypes from "prop-types";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { updateFormDataInStore } from "../data/actions";
import { assignIn } from "lodash";
import { withTheme, Form } from "@react-schema-form/core";
import templates from "./templates";
import widgets from "./widgets";
import { loadModal, hideModal } from "../../../data/reducer";

const BootstrapCustomForm = withTheme("Bootstrap", { widgets, templates })(
  Form
);

const log = type => console.log.bind(console, type);

class JsonSchemaForm extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    // this breaks encapsulation...
    // we expose BootstrapCustomForm to JsonSchemaForm
    // and then expost JsonSchemaForm to JsonSchemaFormsAccordion
    // to validate 10 forms when the user want to go to the next stpe
    // consider move the whole 'validate' function to redux store
    this.props.onRef && this.props.onRef(this.form);
  }

  handleFormInvalidation() {
    this.props.loadModal("CONFIRMATION_MODAL", {
      title: "Are you sure?",
      message: "Do you wish to skip this step?",
      hideModal: this.props.hideModal,
      submit: {
        label: "Yes",
        handler: this.props.submit.handler
      },
      cancel: {
        label: "No",
        handler: this.props.hideModal
      }
    });
  }

  isDependentSelectWidget(allowedValues) {
    return (
      allowedValues &&
      allowedValues.length === 1 &&
      JSON.stringify(allowedValues[0]) === "[{}]"
    );
  }

  transformErrors(errors) {
    // filter out the errors caused by DependentSelectWidget
    // we replace the placeholder enum options [{}] with designated form data
    // causing error because the user selected value is never one of the allowed valued
    return errors.filter(error => {
      return this.isDependentSelectWidget(error.params.allowedValues);
    });
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
      onChange,
      loadModal,
      hideModal
    } = this.props;

    const handleChange = onChange || updateFormDataInStore;

    return (
      <div>
        <BootstrapCustomForm
          key={id}
          onRef={ref => (this.form = ref)}
          noHtml5Validate={true}
          schema={schema}
          uiSchema={uiSchema}
          formData={formData}
          onSubmit={submit ? submit.handler : () => {}}
          invalidCallback={this.handleFormInvalidation}
          onChange={handleChange}
          onError={log("errors")}
          showErrorList={false}
          transformErrors={this.transformErrors}
        >
          <div className="d-flex justify-content-end mt-5">
            {cancel && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={cancel.handler}
              >
                {cancel.label}
              </button>
            )}
            {submit && (
              <button type="submit" className="btn btn-primary ml-2">
                {submit.label}
              </button>
            )}
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
    ),
  loadModal: (modalType, modalProps) =>
    dispatch(loadModal(modalType, modalProps)),
  hideModal: () => dispatch(hideModal())
});

export default connect(
  mapState,
  mapDispatch
)(JsonSchemaForm);
