import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import { keys } from "lodash";
import Instructions from "./Instructions";
import JsonSchemaForm from "./JsonSchemaForm";
import { templates } from "@react-schema-form/bootstrap";
import { loadModal, hideModal } from "../../../data/reducer";

class JsonSchemaFormsAccordion extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      activeAccordionItemId: 0
    };
    this.form = {};
    this.incompleteForm = [];
  }

  handleAccordionChange(key) {
    this.setState({
      activeAccordionItemId: key
    });
  }

  nextAccordionItem() {
    this.setState(prevState => ({
      activeAccordionItemId: (prevState.activeAccordionItemId + 1) % 10
    }));
  }

  prevAccordionItem() {
    this.setState(prevState => ({
      activeAccordionItemId: (prevState.activeAccordionItemId - 1) % 10
    }));
  }

  handleNextStep() {
    // validate all from here
    const valid = keys(this.form).reduce((vaild, key) => {
      const { errors } = this.form[key].validate(this.form[key].state.formData);
      if (keys(errors).length > 0)
        this.incompleteForm.push(this.form[key].props.schema.title);
      return keys(errors).length > 0 && valid;
    }, true);
    if (valid) this.props.submit.handler();
    else
      this.props.loadModal("CONFIRMATION_MODAL", {
        title: "Are you sure?",
        message:
          "You haven't completed the following parts, do you wish to skip this step?",
        errors: this.incompleteForm,
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

  render() {
    const {
      id,
      accordionInstructions,
      accordionOrder,
      formData,
      submit,
      cancel,
      className,
      version,
      ...accordionContext
    } = this.props;

    return (
      <div className={className}>
        {accordionInstructions && (
          <Instructions content={accordionInstructions} isNotStep={true} />
        )}
        <Accordion onChange={this.handleAccordionChange}>
          {accordionOrder.map((accordionItemKey, i) => (
            <AccordionItem
              key={accordionItemKey}
              expanded={this.state.activeAccordionItemId === i}
            >
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">
                  {accordionContext[accordionItemKey].schema.title}
                </p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <JsonSchemaForm
                  onRef={ref => (this.form[i] = ref)}
                  id={`${id}-accordion__${i}`}
                  {...accordionContext[accordionItemKey]}
                  formData={formData[accordionItemKey]}
                  formDataPath={`${id}.${accordionItemKey}`}
                  version={version}
                  submit={
                    i !== accordionOrder.length - 1
                      ? {
                          label: "save and continue",
                          handler: this.nextAccordionItem
                        }
                      : {
                          label: "next step",
                          handler: submit.handler
                        }
                  }
                  cancel={
                    i !== 0
                      ? {
                          label: "previous principle",
                          handler: this.prevAccordionItem
                        }
                      : null
                  }
                />
              </AccordionItemBody>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="d-flex justify-content-end mt-5">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={cancel.handler}
          >
            {cancel.label}
          </button>
          <button
            type="button"
            className="btn btn-primary ml-2"
            onClick={this.handleNextStep}
          >
            {submit.label}
          </button>
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({ ...ownProps });

const mapDispatch = (dispatch, ownProps) => ({
  loadModal: (modalType, modalProps) =>
    dispatch(loadModal(modalType, modalProps)),
  hideModal: () => dispatch(hideModal())
});

export default connect(
  mapState,
  mapDispatch
)(JsonSchemaFormsAccordion);
