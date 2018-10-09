import React, { Component } from "react";
import autoBind from "react-autobind";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import { templates } from "@react-schema-form/bootstrap";

export default class AccordionField extends Component {
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

  next() {
    this.setState(prevState => ({
      activeAccordionItemId: (prevState.activeAccordionItemId + 1) % 10
    }));
  }

  render() {
    console.log(this.props);

    if (this.props.uiSchema["ui:template"] === "accordion")
      return (
        <Accordion onChange={this.handleAccordionChange}>
          {this.props.properties.map((prop, i) => (
            <AccordionItem
              key={prop.content.key}
              expanded={this.state.activeAccordionItemId === i}
            >
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">title</p>
              </AccordionItemTitle>
              <AccordionItemBody>{prop.content}</AccordionItemBody>
            </AccordionItem>
          ))}
        </Accordion>
      );
    else return <templates.ObjectFieldTemplate {...this.props} />;
  }
}
