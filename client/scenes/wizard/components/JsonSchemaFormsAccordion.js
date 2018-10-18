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
                  submit={{ label: "next", handler: this.nextAccordionItem }}
                  cancel={{ label: "back", handler: this.prevAccordionItem }}
                />
              </AccordionItemBody>
            </AccordionItem>
          ))}
        </Accordion>
        <div>
          <button type="button" onClick={submit.handler}>
            {submit.label}
          </button>
          <button type="button" onClick={cancel.handler}>
            {cancel.label}
          </button>
        </div>
      </div>
    );
  }
}
