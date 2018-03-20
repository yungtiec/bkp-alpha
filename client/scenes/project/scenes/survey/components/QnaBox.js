import React, { Component } from "react";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";
import { Question, Answers } from "./index";

class QnaBox extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    const annotation = $(this[`qna-${this.props.qna.id}`]).annotator();
    annotation.annotator("addPlugin", "Store", {
      prefix: "/api/annotation",
      loadFromSearch: {
        uri: `http://localhost:8080${this.props.match.url}`,
        survey_question_id: this.props.qna.id
      },
      annotationData: {
        uri: `http://localhost:8080${this.props.match.url}`,
        survey_question_id: this.props.qna.id
      },
      urls: {
        create: "/store",
        update: "/update/:id",
        destroy: "/delete/:id",
        search: "/search/"
      }
    });
  }

  render() {
    const { qna } = this.props;

    return (
      <div ref={el => (this[`qna-${qna.id}`] = el)}>
        <Question question={qna.question} />
        <Answers answers={qna.survey_answers} />
      </div>
    );
  }
}

export default withRouter(QnaBox);
