import React, { Component } from "react";
import autoBind from "react-autobind";

export default class Question extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    return (
      <h5
        className="qna__question"
        onClick={e => {
          this.props.handleAnnotationOnClick(e, this.props.qnaId);
        }}
      >
        {this.props.question.text}
      </h5>
    );
  }
}
