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
      next,
      back,
      ...accordionContext
    } = this.props;

    return (
      <div>
        {accordionInstructions && (
          <Instructions content={accordionInstructions} />
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
                  next={this.nextAccordionItem}
                  back={this.prevAccordionItem}
                />
              </AccordionItemBody>
            </AccordionItem>
          ))}
        </Accordion>
        <div>
          <button type="button" onClick={next}>
            next
          </button>
          <button type="button" onClick={back}>
            back
          </button>
        </div>
      </div>
    );
  }
}
