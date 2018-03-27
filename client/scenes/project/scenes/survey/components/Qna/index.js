import React, { Component } from "react";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";
import Question from "./Question";
import Answers from "./Answers";

class QnaBox extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    const { qna, match, isLoggedIn } = this.props;
    if (!this.annotation) {
      this.annotation = $(this[`qna-${qna.id}`]).annotator();
      this.annotation.annotator("addPlugin", "Store", {
        prefix: "/api/annotator",
        loadFromSearch: {
          uri: `http://localhost:8080${match.url}`,
          survey_question_id: qna.id
        },
        annotationData: {
          uri: `http://localhost:8080${match.url}`,
          survey_question_id: qna.id
        },
        urls: {
          create: "/store",
          update: "/update/:id",
          destroy: "/delete/:id",
          search: "/search/"
        }
      });
    }

    /**
     * guest user cannot annotate
     * let's hide the annotatorjs widget
     */
    $(".annotator-adder button").click(function(event) {
      if (!isLoggedIn) event.stopPropagation();
    });
    if (!isLoggedIn) {
      $(".annotator-adder").css("opacity", 0);
      $(".annotator-adder button").css("cursor", "text");
    } else {
      $(".annotator-adder").css("opacity", 1);
      $(".annotator-adder").css("cursor", "pointer");
    }
  }

  componentWillReceiveProps(nextProps) {
    const prevProjectSymbol = this.props.match.url.split("/")[2];
    const nextProjectSymbol = nextProps.match.url.split("/")[2];
    const prevSurveyId = this.props.match.params.surveyId;
    const nextSurveyId = nextProps.match.params.surveyId;
    if (
      prevProjectSymbol &&
      prevSurveyId &&
      (prevProjectSymbol !== nextProjectSymbol || prevSurveyId !== nextSurveyId)
    ) {
      this.annotation = $(this[`qna-${this.props.qna.id}`]).annotator();
    }
  }

  render() {
    const { qna } = this.props;

    return (
      <div className="qna__container" ref={el => (this[`qna-${qna.id}`] = el)}>
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(QnaBox);
