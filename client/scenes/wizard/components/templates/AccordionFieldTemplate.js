import React, { Component } from "react";
import autoBind from "react-autobind";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";

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

    return (
      <Accordion onChange={this.handleAccordionChange}>
        {this.props.properties.map((prop, i) => (
          <AccordionItem
            key={prop.content.key}
            expanded={this.state.activeAccordionItemId === i}
          >
            <AccordionItemTitle>
              <p className="upload-accordion__item-header">
                {prop.content.props.schema.title}
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>{prop.content}</AccordionItemBody>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }
}

// merge
