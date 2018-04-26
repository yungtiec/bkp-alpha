import React, { Component } from "react";
import autoBind from "react-autobind";
import ReactMarkdown from "react-markdown";

export default class Question extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    return (
      <ReactMarkdown
        className="qna__question"
        onClick={e => {
          this.props.handleAnnotationOnClick(e, this.props.qnaId);
        }}
        source={this.props.question.markdown}
      />
    );
  }
}
