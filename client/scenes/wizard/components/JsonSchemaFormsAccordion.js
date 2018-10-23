import React, { Component } from "react";
import autoBind from "react-autobind";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import Instructions from "./Instructions";
import JsonSchemaForm from "./JsonSchemaForm";
import { templates } from "@react-schema-form/bootstrap";

export default class JsonSchemaFormsAccordion extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      activeAccordionItemId: 0
    };
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

  render() {
    const {
      id,
      accordionInstructions,
      accordionOrder,
      formData,
      submit,
      cancel,
      ...accordionContext
    } = this.props;

    return (
      <div>
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
                  {...accordionContext[accordionItemKey]}
                  formData={formData[accordionItemKey]}
                  formDataPath={`${id}.${accordionItemKey}`}
                  submit={
                    i !== accordionOrder.length - 1
                      ? {
                          label: "next principle",
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
            onClick={submit.handler}
          >
            {submit.label}
          </button>
        </div>
      </div>
    );
  }
}
