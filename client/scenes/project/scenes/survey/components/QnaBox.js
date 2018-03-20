import React, { Component } from "react";
import autoBind from "react-autobind";
import { Question, Answers } from "./index";

export default class QnaBox extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { qna } = this.props;

    return (
      <div>
        <Question question={qna.question} />
        <Answers answers={qna.survey_answers} />
      </div>
    );
  }
}
