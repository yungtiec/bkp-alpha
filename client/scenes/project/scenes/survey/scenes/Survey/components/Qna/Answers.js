import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import autoBind from "react-autobind";
import { find, keyBy, clone } from "lodash";

export default class Answers extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  renderAnswer({ answer, qnaId, handleCommentOnClick }) {
    return (
      <div
        key={`qna-${qnaId}__answer--${answer.id}`}
        onClick={e => {
          handleCommentOnClick(e, qnaId, answer.id);
        }}
      >
        <ReactMarkdown className="qna__answer" source={answer.markdown} />
      </div>
    );
  }

  render() {
    const { answers, qnaId, handleCommentOnClick } = this.props;

    return (
      <div className="qna__answer-container">
        {this.renderAnswer({
          answer: answers[0],
          qnaId,
          handleCommentOnClick
        })}
        {answers.children &&
          answers.children.map(child =>
            this.renderAnswer({ answer: child, qnaId, handleCommentOnClick })
          )}
      </div>
    );
  }
}
