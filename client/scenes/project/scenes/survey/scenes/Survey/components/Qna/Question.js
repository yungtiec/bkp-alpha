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
      <div
        onClick={e => {
          this.props.handleCommentOnClick(e, this.props.qnaId);
        }}
      >
        {this.props.isDividerTitle ? (
          <div className="qna__question">
            <h2>{this.props.question.markdown.replace("### ", "")}</h2>
          </div>
        ) : (
          <ReactMarkdown
            className="qna__question"
            source={this.props.question.markdown}
          />
        )}
      </div>
    );
  }
}
