import React, { Component } from "react";
import autoBind from "react-autobind";

export default class Question extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    return <div>{this.props.question.text}</div>;
  }
}
