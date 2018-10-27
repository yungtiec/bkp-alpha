import "./JsonSchemaForm.scss";
import React, { Component } from "react";
import PropTypes from "prop-types";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { updateFormDataInStore, updateVersionContentJson } from "../data/actions";
import { assignIn } from "lodash";
import { withTheme, Form } from "@react-schema-form/core";
import templates from "./templates";
import widgets from "./widgets";
import { loadModal, hideModal } from "../../../data/reducer";
import { withRouter } from "react-router-dom";
import { matchPath } from 'react-router'

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

  async next() {
    console.log('hitting next here');
    console.log(this.props);

    const match = matchPath(this.props.history.location.pathname, {
      path: '/wizard/step/:step/version/:id',
    });
    console.log(match.params.id);
    await this.props.updateVersionContentJson(match.params.id);
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
          //onSubmit={submit ? submit.handler : () => {}}
          onSubmit={this.next}
          invalidCallback={this.handleFormInvalidation}
          onChange={handleChange}
          onError={log("errors")}
          showErrorList={false}
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
  updateVersionContentJson: versionId => {
    dispatch(
      updateVersionContentJson(versionId)
    )
  },
  loadModal: (modalType, modalProps) =>
    dispatch(loadModal(modalType, modalProps)),
  hideModal: () => dispatch(hideModal())
});

export default withRouter(connect(
  mapState,
  mapDispatch
)(JsonSchemaForm));
