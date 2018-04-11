import React, { Component } from "react";
import autoBind from "react-autobind";
import { find, keyBy, clone } from "lodash";

export default class Answers extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { answers, qnaId, handleAnnotationOnClick } = this.props;
    const latestAnswer = find(
      answers,
      answer => answer.references.length === answers.length - 1
    );
    var answerOrder;
    if (latestAnswer.references.length) {
      answerOrder = clone(latestAnswer.references);
      answerOrder.push(latestAnswer.id);
    } else {
      answerOrder = [latestAnswer.id];
    }
    const answersById = keyBy(answers, "id");
    return (
      <div className="qna__answer-container">
        {answerOrder.map(id => (
          <p
            className="qna__answer"
            onClick={e => {
              handleAnnotationOnClick(e, qnaId, id);
            }}
          >
            {answersById[id].answer}
            {answersById[id].link && (
              <a style={{ marginLeft: "5px" }} target="_blank" href={answersById[id].link}>
                {answersById[id].linkLabel}
              </a>
            )}
          </p>
        ))}
      </div>
    );
  }
}
