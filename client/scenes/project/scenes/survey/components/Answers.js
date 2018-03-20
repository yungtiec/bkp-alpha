import React, { Component } from "react";
import autoBind from "react-autobind";
import { find, keyBy } from "lodash";

export default class Answers extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { answers } = this.props;
    const latestAnswer = find(
      answers,
      answer => answer.references.length === answers.length - 1
    );
    const answerOrder = latestAnswer.references.length ? latestAnswer.references.push(latestAnswer.id) : [latestAnswer.id]
    const answersById = keyBy(answers, "id");

    return (
      <div className="qna__answer-container">{answerOrder.map(id => <p className="qna__answer">{answersById[id].answer}</p>)}</div>
    );
  }
}
