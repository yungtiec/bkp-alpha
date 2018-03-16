import React, { Component } from "react";
import autoBind from "react-autobind";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";
import { TestArticle, TestArticle2 } from "./index";

export default class Test extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    return (
      <div ref={el => (this.article = el)}>
        <TestArticle />
        <TestArticle2 />
      </div>
    );
  }
}
