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
      <div>{answerOrder.map(id => <div>{answersById[id].answer}</div>)}</div>
    );
  }
}
