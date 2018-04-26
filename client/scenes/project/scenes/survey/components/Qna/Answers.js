import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import autoBind from "react-autobind";
import { find, keyBy, clone } from "lodash";

export default class Answers extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  renderAnswer({ answer, qnaId, handleAnnotationOnClick }) {
    return (
      <div
        key={`qna-${qnaId}__answer--${answer.id}`}
        onClick={e => {
          handleAnnotationOnClick(e, qnaId, answer.id);
        }}
      >
        <ReactMarkdown className="qna__answer" source={answer.markdown} />
      </div>
    );
  }

  render() {
    const { answers, qnaId, handleAnnotationOnClick } = this.props;

    return (
      <div className="qna__answer-container">
        {this.renderAnswer({
          answer: answers[0],
          qnaId,
          handleAnnotationOnClick
        })}
        {answers.children &&
          answers.children.map(child =>
            this.renderAnswer({ answer: child, qnaId, handleAnnotationOnClick })
          )}
      </div>
    );
  }
}
